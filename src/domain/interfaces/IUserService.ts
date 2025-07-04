
/**
 * User Service Interface
 * Defines contract for user operations
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserService {
  /**
   * Get user by ID
   */
  getUser(userId: string): Promise<User | null>;

  /**
   * Update user profile
   */
  updateUser(userId: string, updates: Partial<User>): Promise<User>;

  /**
   * Get users by organization
   */
  getUsersByOrganization(organizationId: string): Promise<User[]>;
}
