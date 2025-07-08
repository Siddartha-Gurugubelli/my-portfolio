
import { BlogService } from '../services/blogService';
import { searchBlogItems } from '../utils/searchUtils';

interface SearchResult {
  item: {
    id: string;
    type: string;
    title?: string;
    description?: string;
    author?: string;
    date?: string;
    createdOn?: string;
    tags?: string[];
  };
  categoryId: string;
  categoryTitle: string;
  path: string[];
  relevanceScore: number;
}

let allBlogItems: SearchResult[] = [];
let isInitialized = false;

// Initialize blog data
const initializeData = async () => {
  if (isInitialized) return;
  
  try {
    const data = await BlogService.fetchBlogsData();
    const items: SearchResult[] = [];
    
    for (const category of data.categories) {
      if (category.indexUrl) {
        try {
          const nestedIndex = await BlogService.fetchNestedBlogIndex(category.indexUrl);
          const flattenItems = (blogItems: any[], path: string[] = []): void => {
            blogItems.forEach(item => {
              const currentPath = [...path, item.title || ''];
              items.push({
                item,
                categoryId: category.id,
                categoryTitle: category.title,
                path: currentPath,
                relevanceScore: 0
              });
              
              if (item.type === "directory" && item.children) {
                flattenItems(item.children, currentPath);
              }
            });
          };
          
          if (nestedIndex.children) {
            flattenItems(nestedIndex.children);
          }
        } catch (error) {
          console.error(`Failed to load nested index for ${category.id}:`, error);
        }
      } else if (category.children) {
        category.children.forEach(post => {
          const blogItem = {
            id: post.id,
            type: "file",
            path: post.path || post.contentPath || '',
            title: post.title || '',
            description: post.description,
            date: post.date,
          };
          
          items.push({
            item: blogItem,
            categoryId: category.id,
            categoryTitle: category.title,
            path: [post.title || ''],
            relevanceScore: 0
          });
        });
      }
    }
    
    allBlogItems = items;
    isInitialized = true;
    
    // Notify main thread that initialization is complete
    self.postMessage({
      type: 'INIT_COMPLETE',
      data: { itemCount: allBlogItems.length }
    });
    
  } catch (error) {
    console.error('Failed to initialize search data:', error);
    self.postMessage({
      type: 'INIT_ERROR',
      error: error.message
    });
  }
};

// Handle search requests
const performSearch = (searchQuery: string) => {
  if (!isInitialized) {
    self.postMessage({
      type: 'SEARCH_ERROR',
      error: 'Search index not initialized'
    });
    return;
  }
  
  const results = searchQuery.trim() ? searchBlogItems(allBlogItems, searchQuery) : [];
  
  self.postMessage({
    type: 'SEARCH_RESULTS',
    data: results
  });
};

// Listen for messages from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'INIT':
      initializeData();
      break;
    case 'SEARCH':
      performSearch(data.query);
      break;
    default:
      console.warn('Unknown message type:', type);
  }
});
