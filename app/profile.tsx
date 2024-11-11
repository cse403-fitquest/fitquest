import { updateUserProfile, getUserProfile } from '@/services/firebase'; // Import Firebase functions

const Profile = () => {
  // ... existing code ...

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfile = await getUserProfile(user.id); // Fetch user profile from Firebase
      setUser(userProfile);
    };
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!user) return;

    const updates = {
      profileInfo: {
        ...user.profileInfo,
        username: username.trim(),
        height: parseFloat(height),
        weight: parseFloat(weight),
      },
      privacySettings: {
        isCurrentQuestPublic: isCurrentQuestPublic ?? false,
        isLastWorkoutPublic: isLastWorkoutPublic ?? false,
      },
      currentQuest: user.currentQuest, // Include current quest
    };

    const response = await updateUserProfile(user.id, updates); // Update in Firebase

    // ... existing code ...
  };

  // ... existing code ...
};

export default Profile; 