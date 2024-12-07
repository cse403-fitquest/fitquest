
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

```bash
fitquest/
├── .github/
│   └── workflows/            # GitHub Actions workflow configurations
├── app/                      # Screens
│   ├── auth/                 # Auth screens
│   ├── onboarding/           # Onboarding screens
│   └── tabs/                 # Tab screens
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

    - Ensure you have Node.js (version 20.x LTS) and Yarn or npm installed.

    - Run:

        ```bash
        npm install
        ```

2. Start the Development Server:

    ```bash
    npm start
    ```

3. Run on Physical Device using expo QR code or Run on Android Emulator:

   With an android device, the fastest way to use the app is to use your physical device through expo. Download and install Exp Go SDK 51 (https://expo.dev/go?sdkVersion=51&platform=android&device=true). When the app is running after completing step 2, scan the QR code given in the terminal in the Expo Go application.

   Our app currently does not support iPhones, so using Expo Go with your iPhone will likely result in a crash or unintended bug(s).

   With other devices such as a laptop, you will need to work with an android emulator to run the app. Following the instructions from the link will take around 15 minutes to setup depending on whether you have installed android studio: https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=expo-go. Be sure to select "Android Emulator" for the first option and "Expo Go" for the second option.


> **Note:** Ensure you have the necessary emulators or physical devices connected for testing.

### **4. How to Test the Software**

Running Tests:

1. Unit Tests:

    - Execute the following command to run all Jest tests:

        ```bash
        npm test
        ```

    - Or you can run it in watch mode which reruns the tests automatically when saving changes with the following command:

        ```bash
        npm run test:dev
        ```

**Accessing Test Results:**

- Test results will be displayed in the terminal after execution.

**Referencing User Documentation:**

For prerequisites and environment setup, refer to the User Manual.

### **5. How to Add New Tests**
Adding a New Test:

1. Identify the Component or Function:

    - Determine which component or utility function you want to test.

2. Create a Test File:

    - For a component named NewComponent, create NewComponent.test.tsx in the appropriate `__tests__` directory, e.g., `/tests/components/__tests__/NewComponent.test.tsx`.

3. Write Test Cases:

    - Use Jest and React Native Testing Library for unit and integration tests.

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

    - Execute `npm test` to ensure your new tests pass.

5. Commit the Test File:

    - Checkout to a new branch from the `develop` branch (with latest changes) with an appropriate prefix (eg. fix/, feat/, refactor/, test/)
    - Add and commit changes to your new brench
    - Create a pull request and request to be reviewed by one of the other developers

        ```bash
        git checkout -b test/new-component
        git add /tests/components/__tests__/NewComponent.test.tsx
        git commit -m "Add tests for NewComponent"
        git push --set-upstream origin test/new-component
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
