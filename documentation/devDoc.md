
### Developer Documentation

# FitQuest Developer Guidelines

### **1. How to Obtain the Source Code**
The FitQuest source code is hosted on GitHub. To obtain the source code, follow these steps:

1. Clone the Repository:

    - Open your terminal or command prompt.

    - Run the following command to clone the repository:

        ```bash
        git clone https://github.com/cse403-fitquest/fitquest.git
        ```

2. Navigate to the Project Directory:

    ```bash
    cd fitquest
    ```

3. Install Dependencies:

    - Ensure you have Node.js (version 20.x LTS) and npm installed.

    - Run:

        ```bash
        npm install
        ```

#

### **2. Directory Structure Layout**
The FitQuest project follows a modular directory structure to enhance maintainability and scalability. Below is an overview of the directory layout:

```
fitquest/
├── .github/
│   └── workflows/            # GitHub Actions workflow configurations
├── app/                      # Screens
│   ├── auth/                 # Auth screens
│   └── tabs/                 # Tabbed screens
├── assets/                   # Spritesheets, fonts, and other static assets
├── components/               # Reusable React Native components
├── constants/                # Constants for mocks and base objects
├── store/                    # Hooks for global state management
├── services/                 # Functions that interact with the backend
├── utils/                    # Utility functions and helper modules
├── types/                    # Types for various modules
├── documentation/            # User and developer documentation
├── tests/
│   ├── components/__tests__/ # Test files for components
|   ├── services/__tests__/   # Test files for services functions
│   ├── utils/__tests__/      # Test files for utility functions
│   └── integration/          # Integration test files
├── eslint.config.mjs         # ESLint configuration
├── package.json              # Project dependencies and scripts
├── README.md                 # Project overview
└── ...                       # Additional configuration and documentation files
```

- **app/:** Contains the various screens presented in the app. File-based routing using Expo.

- **components/:** Contains reusable UI components like buttons, avatars, and input fields.

- **services/:** Manages API integrations, authentication logic, and business rules.

- **utils/:** Includes utility functions used across the application, such as fitness level calculations.

- **assets/:** Stores static assets like spritesheets, icons, and fonts.

- **store/:** Provides react hooks for global state management using Zustand libary.

- **tests/:** Contains all test files, organized by component, services function, and utility function.

- **.github/workflows/:** Stores GitHub Actions workflow YAML files for CI/CD processes.

#

### **3. How to Build the Software**

To build FitQuest, follow these steps:

1. Install Dependencies:

    - Ensure you have Node.js (version 14.x or later) and Yarn or npm installed.

    - Run:

        ```bash
        npm install
        ```

2. Start the Development Server:

    ```bash
    npm start
    ```

3. Run on Physical Device using expo barcode or Run on Android Emulator:

    ```bash
    npm run android
    ```


> **Note:** Ensure you have the necessary emulators or physical devices connected for testing.

### **4. How to Test the Software**

Running Tests:

1. Unit and Integration Tests:

    - Execute the following command to run all Jest tests:

        ```bash
        npm test
        ```

2. End-to-End (E2E) Tests: TENTATIVE

    - Ensure you have Detox configured and your emulator/simulator is running.

    - Run Detox tests with:

        ```bash
        detox test
        ```
**Accessing Test Results:**

- Test results will be displayed in the terminal after execution.

- Detailed reports can be found in the /tests/ directory.

**Referencing User Documentation:**

For prerequisites and environment setup, refer to the User Manual.

### **5. How to Add New Tests**
Adding a New Test:

1. Identify the Component or Function:

    - Determine which component or utility function you want to test.

2. Create a Test File:

    - For a component named NewComponent, create NewComponent.test.tsx in the appropriate __tests__ directory, e.g., /tests/components/__tests__/NewComponent.test.tsx.

3. Write Test Cases:

    - Use Jest and React Native Testing Library for unit and integration tests.

    - For E2E tests, use Detox and place tests in the /tests/integration/ directory.

    **Example for a Service / Utility Function:**

    ```typescript
    // /tests/utils/__tests__/newFunction.test.tsx
    import { newFunction } from '@utils/newFunction.ts';

    describe('newFunction', () => {
    it('should return expected output for given input', () => {
        const input = 'test input';
        const expectedOutput = 'expected output';
        expect(newFunction(input)).toBe(expectedOutput);
    });

    // Additional test cases...
    });
    ```

    **Example for a Component:**

    ```typescript
    // /tests/components/__tests__/NewComponent.test.tsx
    import React from 'react';
    import { render, fireEvent } from '@testing-library/react-native';
    import NewComponent from '@/components/NewComponent';

    describe('NewComponent', () => {
    it('renders correctly with default props', () => {
        const { getByTestId } = render(<NewComponent />);
        const element = getByTestId('new-component');
        expect(element).toBeTruthy();
    });

    it('handles user interaction correctly', () => {
        const onPressMock = jest.fn();
        const { getByTestId } = render(<NewComponent onPress={onPressMock} />);
        const button = getByTestId('new-button');
        fireEvent.press(button);
        expect(onPressMock).toHaveBeenCalled();
    });

    // Additional test cases...
    });
    ```

4. Run the Tests:

    - Execute yarn test or npm test to ensure your new tests pass.

5. Commit the Test File:

    - Add and commit your new test file to the repository:

        ```bash
        git add /tests/components/__tests__/NewComponent.test.tsx
        git commit -m "Add tests for NewComponent"
        git push origin main
        ```

**Naming Conventions:**

- Test files should follow the pattern ComponentName.test.tsx or functionName.test.tsx.

- Place test files in their respective __tests__ directories for organization.

### **6. How to Build a Release of the Software**

**Building a Release:**

1. Update Version Number:

    - Increment the version number in package.json following semantic versioning (e.g., 1.0.0 to 1.1.0).

2. Run Tests:

- Ensure all tests pass by running:

    ```bash
    npm test
    ```

3. Build the App:

    For Android:

    ```bash
    npm run build:android
    ```

4. Sanity Checks:

    - Manually test critical features to ensure stability.

5. Create a Release Tag:

    - Tag the release in Git:

        ```bash
        git tag -a v1.1.0 -m "Release version 1.1.0"
        git push origin v1.1.0
        ```

6. Deploy to Google Play Store:

    - Follow the respective guidelines [Google Play Store](https://play.google/developer-content-policy/) to submit the app.

**Manual Tasks:**

- Update Release Notes:

    - Document new features, bug fixes, and known issues in the [Release Notes](https://github.com/cse403-fitquest/fitquest/releases).

- Verify App Store Compliance:

    - Ensure the app meets all submission guidelines for each platform, including metadata, screenshots, and privacy policies.
