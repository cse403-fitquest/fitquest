
### User Documentation


# FitQuest User Manual


**1. High-Level Description**

**FitQuest** is a gamified fitness application designed to transform your workout routine into an engaging RPG-style adventure. By completing real-world physical activities, you embark on quests, battle monsters, and level up your customizable avatar. FitQuest motivates users to stay active by integrating game mechanics with fitness tracking, making exercise both fun and rewarding.

#

**2. How to Install the Software**

Prerequisites:

**Mobile Device:** Android (version 8.0 or later).

or

**Android Emulator:** Installed here https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=expo-go. Ensure that Android Simulator and Expo Go is selected for the first two options

**Internet Connection:** Required for syncing data.

Installation Steps:

Before you start, you will need to have the following tools installed on your PC/Laptop:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/) (LTS).
In addition, it is good to have an editor to work with the code such as [VSCode](https://code.visualstudio.com/).


1. Clone the repository:

   ```bash
   git clone https://github.com/cse403-fitquest/fitquest
   cd fitquest
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Run the app

   ```bash
   npm start
   ```

The terminal should now display a barcode that you can scan in the next step.

> **Note:** Ensure your device meets the minimum OS requirements and has sufficient storage space for installation.

#

**3. How to Run the Software**

1. Download Expo Go SDK 51:

    - Download Expo Go SDK 51 here https://expo.dev/go?sdkVersion=51&platform=android&device=true

2. Launch FitQuest:

    - Go into Expo Go application, select "Scan QR Code", and scan the barcode displayed in the terminal from the installation step.

3. Sign In or Register:

    - If you have an existing account, enter your credentials to sign in.

    - New users can register using their email address through the Sign Up screen.

4. Complete Onboarding:

    - Upon first launch, you'll be guided through an onboarding process to set up your fitness level and customize your avatar attributes.

#

**4. How to Use the Software**

Main Features:

- **Onboarding Wizard:** Assess your fitness level by allocating points to POWER, SPEED, and HEALTH attributes.

- **Quests:** Complete workouts to progress through quests, earn experience points (XP), and battle monsters.

- **Avatar Customization:** Personalize your avatar with various weapons, armor, and accessories.

- **Turn-Based Combat:** Engage in battles against monsters and bosses to claim rewards.

- **Social Connections:** Add friends and view what quests they are on.

- **Reward System:** Earn items to make your avatar stronger.

Using FitQuest:

1. Select a Quest:

    - Navigate to the "Quests" section and choose a quest that you find exciting.

2. Complete Workouts:

    - Perform the workouts in the Workout tab. When completing workouts, you will gain XP, making you progress in your current active quest.

3. Battle Monsters:

    - Progressing through quests may trigger monster encounters. Use your avatar's abilities and equipment to defeat them.

4. Customize Your Avatar:

    - Visit the "Profile" section to change your avatar's items and upgrade attributes as you level up.

**Work in Progress:**

- More Combat Options: Currently, the only combat options include a single attack and health potions. We want combat to be more engaging and personalized by giving users more options for attacks and consumables.

- Better System For Workout XP Gain: Currently, XP gained from workouts are determined based on the length of the workout. In the future, XP gained will be determined based on the workload of exercises performed during the workout. Thus making it such that doing relatively more weights/repitions/sets/etc will yield more XP.

#

**5. How to Report a Bug**

To help us improve FitQuest, please report any bugs you encounter using our [GitHub Issues](https://github.com/cse403-fitquest/fitquest/issues) tracker.

**Reporting a Bug:**

1. Visit the Issue Tracker:

    - Go to our GitHub Repository Issues Page.

2. Create a New Issue:

    - Click on the "New Issue" button.

3. Fill Out the Bug Report Template:

    - **Title:** Provide a clear and concise title for the bug.

    - **Description:** Describe the bug in detail, including the steps to reproduce it.

    - **Expected Behavior:** Explain what you expected to happen.

    - **Actual Behavior:** Describe what actually happened.

    - **Screenshots:** Attach any relevant screenshots or recordings.

    - **Environment:** Specify the device, OS version, and app version where the bug occurred.

4. Submit the Issue:

    - Once all fields are completed, submit the issue for review.

#

**6. Known Bugs**

- Error Handling Failed Requests: Since FitQuest requires an internet connection to synchronize data. There are cases where the stops working or crashes if the user does not have an internet connection while using the app.

- Future Fixes: The above issues are documented and tracked in our GitHub Issues Tracker. We are actively working on resolving them in upcoming updates.
