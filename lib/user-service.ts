import { db } from "./firebase"
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  grade: string;
  school: string;
  address: string;
  bio: string;
  avatar: string;
  interests: string[];
  favoriteSubjects: string[];
  createdAt: any;
  updatedAt: any;
}

class UserService {
  private static instance: UserService;

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  }

  // Create or update user profile
  async saveUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      const timestamp = serverTimestamp();
      const profileUpdate = {
        ...profileData,
        updatedAt: timestamp,
      };

      if (userDoc.exists()) {
        await updateDoc(userRef, profileUpdate);
      } else {
        await setDoc(userRef, {
          ...profileUpdate,
          uid: userId,
          createdAt: timestamp,
        });
      }
    } catch (error) {
      console.error("Error saving user profile:", error);
      throw error;
    }
  }

  // Update profile picture
  async updateProfilePicture(userId: string, avatarUrl: string): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        avatar: avatarUrl,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      throw error;
    }
  }
}

export const userService = UserService.getInstance();
