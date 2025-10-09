# ExploreEase – Your Local Guide 

A smart, web-based trip planning and local discovery platform designed for the VIT-AP University students.

ExploreEase is your go-to companion for discovering the best of what's around. From vibrant attractions and essential services to the perfect restaurant or an exciting event, we help you navigate your local world with ease. Our platform focuses on community-driven insights, verified reviews, and intelligent planning tools to ensure every exploration is seamless and memorable.

---

## 🌟 Key Features

-   **Login & Authentication:**
    -   Secure login flows for VIT-AP students (via university email for enhanced verification).
    -   **Verified Student Reviews** to ensure trustworthy and relevant feedback, helping you avoid fake ratings.

-   **Attractions & Services Guide:**
    -   Comprehensive, categorized listings of local businesses, diverse restaurants, essential services, and popular tourist spots.
    -   Detailed general reviews and ratings, alongside exclusive student-only reviews for unique peer insights.

-   **Trip Planning & Estimation:**
    -   Intelligent trip planner allowing you to select travel days and group size.
    -   Suggests nearby attractions and services, calculates distances, provides accurate cost estimations, and outlines navigation routes.
    -   Auto-suggests optimal vehicle types (bike, car, van) based on your trip details.

-   **Vehicle Rentals:**
    -   A peer-to-peer marketplace where vehicle owners can register their vehicles for rent.
    -   Admin verification ensures authenticity and safety.

-   **Offers & Discounts:**
    -   Live, real-time updates on exclusive discounts and special offers from local restaurants, malls, shops, and various services.

-   **Trending Picks:**
    -   Stay updated with the "Weekly Top 5" most visited places by VIT-AP students, highlighting popular and vibrant spots.

-   **Map Integration:**
    -   Seamless integration with interactive maps for easy navigation and visual discovery of places.

-   **Events Calendar (MyVIT Hub):**
    -   A dedicated section where VIT-AP clubs and individuals can list their upcoming events.
    -   Integrated into the main navigation for easy discovery of campus and local happenings.

-   **Community Chat (MyVIT Hub):**
    -   An open chat section on the MyVIT page for users to discuss events, ask for reviews, share tips about local places, and connect with the broader VIT-AP community.

---

## 🚀 Getting Started

Follow these instructions to set up and run ExploreEase locally.

### Prerequisites

Make sure you have the following installed:

-   [Node.js](https://nodejs.org/en/) (LTS version recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd ExploreEase # Or into your project's root folder
    ```

2.  **Install client-side dependencies:**

    ```bash
    cd client
    npm install # or yarn install
    cd .. # Go back to the root
    ```

3.  **Install server-side dependencies:**

    ```bash
    cd server
    npm install # or yarn install
    cd .. # Go back to the root
    ```
    *(Note: If you have a monorepo setup, `npm install` in the root might install for both.)*

### Environment Variables

Create a `.env` file in your `client` directory (i.e., `client/.env`) and add your API keys:

```dotenv
# client/.env
VITE_GEOAPIFY_API_KEY=your_geoapify_api_key_here
```

### Running the Project

1. Start the server:
Open a terminal in the project's root directory (ExploreEase/).

```bash
npm run dev # This command is configured to start both server and client
```
(Alternatively, you might have separate npm run server and npm run client commands, in which case you'd run them in separate terminals.)


2. Access the application:
Once both the server and client are running, open your web browser and navigate to:
http://localhost:3000 (or whatever port your server is configured to run on).



## 👨‍💻 Contributing
We welcome contributions! If you have suggestions, bug reports, or want to contribute code, please feel free to:

1.Fork the repository.

2.Create a new branch (git checkout -b feature/YourFeature).

3.Make your changes.

4.Commit your changes (git commit -m 'Add new feature').

5.Push to the branch (git push origin feature/YourFeature).

6.Open a Pull Request.
