
import { toast } from "@/components/ui/use-toast";

export interface LostItem {
  id: string;
  name: string;
  description: string;
  color: string;
  brand: string;
  uniqueId: string;
  timestamp: string;
  location: string;
  image: string;
  status: "lost" | "found" | "matched" | "claimed";
  reportedBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface ItemIssue {
  id: string;
  itemId: string;
  userId: string;
  userName: string;
  userEmail: string;
  description: string;
  proof: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// Mock data
let MOCK_ITEMS: LostItem[] = [
  {
    id: "1",
    name: "Blue Nike Backpack",
    description: "Medium-sized backpack with laptop compartment and side pockets",
    color: "Blue",
    brand: "Nike",
    uniqueId: "NKB-2023-1234",
    timestamp: "2023-04-15T14:30:00",
    location: "Central Park, near the fountain",
    image: "/placeholder.svg",
    status: "lost",
    reportedBy: {
      id: "1",
      name: "John Doe",
      email: "user@example.com"
    },
    createdAt: "2023-04-15T15:30:00"
  },
  {
    id: "2",
    name: "Apple AirPods Pro",
    description: "White wireless earphones with charging case",
    color: "White",
    brand: "Apple",
    uniqueId: "AP-PRO-5678",
    timestamp: "2023-04-14T09:15:00",
    location: "Coffee Shop on Main Street",
    image: "/placeholder.svg",
    status: "lost",
    reportedBy: {
      id: "1",
      name: "John Doe",
      email: "user@example.com"
    },
    createdAt: "2023-04-14T10:20:00"
  },
  {
    id: "3",
    name: "Ray-Ban Sunglasses",
    description: "Black wayfarer sunglasses with case",
    color: "Black",
    brand: "Ray-Ban",
    uniqueId: "RB-WF-9012",
    timestamp: "2023-04-16T16:45:00",
    location: "Beach Boardwalk",
    image: "/placeholder.svg",
    status: "found",
    reportedBy: {
      id: "2",
      name: "Admin User",
      email: "admin@example.com"
    },
    createdAt: "2023-04-16T17:30:00"
  }
];

let MOCK_ISSUES: ItemIssue[] = [];

// Get all items
export const getAllItems = async (): Promise<LostItem[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...MOCK_ITEMS];
};

// Get item by ID
export const getItemById = async (id: string): Promise<LostItem | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  const item = MOCK_ITEMS.find(item => item.id === id);
  return item || null;
};

// Search items
export const searchItems = async (
  timestamp?: string,
  description?: string,
  color?: string,
  brand?: string,
  type?: string
): Promise<LostItem[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return MOCK_ITEMS.filter(item => {
    // If no filters provided, return all items
    if (!timestamp && !description && !color && !brand && !type) {
      return true;
    }
    
    let match = true;
    
    if (timestamp && new Date(item.timestamp).toLocaleDateString() !== new Date(timestamp).toLocaleDateString()) {
      match = false;
    }
    
    if (description && !item.description.toLowerCase().includes(description.toLowerCase()) &&
        !item.name.toLowerCase().includes(description.toLowerCase())) {
      match = false;
    }
    
    if (color && !item.color.toLowerCase().includes(color.toLowerCase())) {
      match = false;
    }
    
    if (brand && !item.brand.toLowerCase().includes(brand.toLowerCase())) {
      match = false;
    }
    
    if (type && !item.name.toLowerCase().includes(type.toLowerCase())) {
      match = false;
    }
    
    return match;
  });
};

// Add new item
export const addItem = async (item: Omit<LostItem, "id" | "createdAt" | "status">): Promise<LostItem> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newItem: LostItem = {
    ...item,
    id: String(MOCK_ITEMS.length + 1),
    status: "lost",
    createdAt: new Date().toISOString(),
  };
  
  MOCK_ITEMS.push(newItem);
  
  toast({
    title: "Item reported successfully",
    description: "Your lost item has been reported. We'll notify you if someone finds it.",
  });
  
  return newItem;
};

// Update item status
export const updateItemStatus = async (id: string, status: LostItem["status"]): Promise<LostItem | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const itemIndex = MOCK_ITEMS.findIndex(item => item.id === id);
  if (itemIndex === -1) return null;
  
  MOCK_ITEMS[itemIndex] = {
    ...MOCK_ITEMS[itemIndex],
    status,
  };
  
  return MOCK_ITEMS[itemIndex];
};

// Delete item
export const deleteItem = async (id: string): Promise<boolean> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const initialLength = MOCK_ITEMS.length;
  MOCK_ITEMS = MOCK_ITEMS.filter(item => item.id !== id);
  
  if (MOCK_ITEMS.length < initialLength) {
    toast({
      title: "Item deleted",
      description: "The item has been removed successfully",
    });
    return true;
  }
  
  return false;
};

// Create issue
export const createIssue = async (issue: Omit<ItemIssue, "id" | "createdAt" | "status">): Promise<ItemIssue> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newIssue: ItemIssue = {
    ...issue,
    id: String(MOCK_ISSUES.length + 1),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  
  MOCK_ISSUES.push(newIssue);
  
  toast({
    title: "Issue raised successfully",
    description: "Your issue has been submitted and will be reviewed by an admin.",
  });
  
  return newIssue;
};

// Get all issues
export const getAllIssues = async (): Promise<ItemIssue[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...MOCK_ISSUES];
};

// Get issues by item ID
export const getIssuesByItemId = async (itemId: string): Promise<ItemIssue[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_ISSUES.filter(issue => issue.itemId === itemId);
};

// Update issue status
export const updateIssueStatus = async (
  id: string, 
  status: ItemIssue["status"]
): Promise<ItemIssue | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const issueIndex = MOCK_ISSUES.findIndex(issue => issue.id === id);
  if (issueIndex === -1) return null;
  
  MOCK_ISSUES[issueIndex] = {
    ...MOCK_ISSUES[issueIndex],
    status,
  };
  
  return MOCK_ISSUES[issueIndex];
};
