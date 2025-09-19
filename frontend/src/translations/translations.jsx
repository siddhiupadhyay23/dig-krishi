export const translations = {
  en: {
    // Navbar translations
    navbar: {
      signUp: "Sign Up",
      login: "Login",
      language: "മലയാളം" // Shows Malayalam when in English
    },
    
    // Common UI elements
    common: {
      getStarted: "Get Started",
      loading: "Loading...",
      signIn: "Sign In",
      signUp: "Sign Up",
      back: "Back",
      login: "Login",
      logout: "Logout",
      creatingAccount: "Creating Account...",
      signingIn: "Signing In...",
      loginRequired: "Login Required",
      loginRequiredMessage: "Please login to ask questions to our AI assistant."
    },
    
    // Hero Section translations
    hero: {
      title: "A Farmer AI",
      titleItalic: "Assistant",
      slogan: "Always available, always learning, and always farmer-first",
      chatPlaceholder: "Ask me anything about farming..."
    },
    
    // Features Section translations
    features: {
      subtitle: "Our Features",
      title: "AI-Powered Farmer Query & Advisory System",
      cards: [
        {
          title: "Natural Language Query Handling",
          description: "Ask questions naturally in Malayalam about crops, pests, or weather—AI understands and responds instantly."
        },
        {
          title: "Multimodal Inputs", 
          description: "Upload images of diseased crops or leave voice notes for quick diagnosis and recommendations."
        },
        {
          title: "AI-Powered Knowledge Engine",
          description: "Leverages local crop data, pest advisories, weather updates, and government schemes to provide accurate advice."
        },
        {
          title: "Context Awareness",
          description: "Personalized guidance based on your farm's location, crop type, season, and previous history."
        },
        {
          title: "Escalation System",
          description: "For complex issues, queries are routed to local agriculture experts along with relevant context."
        },
        {
          title: "Continuous Learning Loop",
          description: "AI improves over time using real farmer queries, feedback, and expert inputs for smarter responses."
        }
      ]
    },
    
    // More/Services section translations
    services: {
      subtitle: "Our Services",
      title: "Transforming Agriculture with Smart Solutions",
      liveChat: {
        title: "LIVE CHAT",
        description: "Instant help via live chat, with faster responses for Premium members. Get immediate assistance from our agricultural experts anytime you need guidance.",
        button: "CHAT WITH US"
      },
      emailSupport: {
        title: "EMAIL SUPPORT",
        description: "Reach out for more detailed inquiries, and we'll get back to you within 24 hours. Perfect for complex agricultural questions and comprehensive solutions.",
        button: "WRITE US"
      },
      phoneSupport: {
        title: "PHONE SUPPORT",
        description: "For Premium users, available Mon-Fri, 9 AM - 6 PM (EST) for urgent assistance. Direct phone support for immediate problem-solving and expert consultation.",
        button: "CALL US"
      }
    },
    
    // Footer translations
    footer: {
      brand: {
        title: "Empowering Agriculture",
        subtitle: "Through Digital Innovation",
        getStarted: "Get Started"
      },
      services: {
        title: "SERVICES",
        cropPrediction: "Crop Prediction",
        reports: "Reports",
        governmentServices: "Government Services",
        dashboard: "Dashboard"
      },
      resources: {
        title: "RESOURCES",
        features: "Features",
        profile: "Profile",
        howItWorks: "How It Works",
        login: "Login"
      },
      copyright: "© 2024 DigKrishi. Transforming agriculture through technology."
    },
    
    // Profile page translations
    profile: {
      title: "Farmer Profile",
      subtitle: "Manage your agricultural profile, farm details, and account settings",
      welcome: "Welcome",
      complete: "Complete",
      loading: "Loading your profile...",
      loadingMessage: "Please wait while we fetch your information.",
      sections: {
        personal: "Personal Information",
        farm: "Farm Details",
        crops: "My Crops",
        analytics: "Farm Analytics",
        settings: "Settings",
        support: "Help & Support"
      },
      personalInfo: {
        title: "Personal Information",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email Address",
        phone: "Phone Number",
        state: "State",
        city: "City",
        district: "District (Optional)",
        pincode: "Pincode",
        age: "Age",
        gender: "Gender",
        education: "Education Level",
        occupation: "Primary Occupation",
        income: "Annual Income Range",
        changePhoto: "Change Photo",
        removePhoto: "Remove",
        edit: "Edit",
        cancel: "Cancel",
        save: "Save Changes",
        saving: "Saving..."
      },
      farmDetails: {
        title: "Farm Details",
        farmName: "Farm Name",
        farmSize: "Farm Size",
        primaryCrops: "Primary Crops",
        secondaryCrops: "Secondary Crops (Optional)",
        experience: "Farming Experience",
        method: "Farming Method",
        farmState: "Farm State",
        farmCity: "Farm City",
        farmDistrict: "Farm District (Optional)",
        farmPincode: "Farm Pincode (Optional)",
        landType: "Land Type",
        soilType: "Soil Type",
        soilDetails: "Soil Details (Optional but Recommended)",
        waterIrrigation: "Water & Irrigation",
        infrastructure: "Farm Infrastructure",
        equipment: "Equipment & Inputs",
        economic: "Economic Information",
        saveFarm: "Save Farm Details"
      },
      errors: {
        serverError: "Internal server error",
        loadFailed: "Failed to load profile data. Please refresh the page.",
        updateFailed: "Failed to update information. Please try again.",
        authRequired: "You need to log in to access your profile. Please log in again."
      },
      common: {
        success: "Success:",
        error: "Error:",
        loadingWeather: "Loading weather...",
        weatherUnavailable: "Weather Unavailable",
        checkConnection: "Check connection",
        newNotifications: "New Notifications!",
        closePopup: "×",
        activeCrops: "Active Crops",
        seasonActive: "Season Active",
        profileComplete: "Profile Complete",
        noCropsSelected: "No crops selected",
        addFirstCrop: "+ Add Your First Crop",
        noCropsAdded: "No Crops Added Yet",
        startAddingCrops: "Start by adding your crops in the Farm Details section",
        loadingAnalytics: "Loading analytics data...",
        noAnalyticsData: "No Analytics Data Available",
        completeProfileAnalytics: "Complete your profile to see detailed farm analytics",
        setupProfile: "Complete Profile Setup",
        dataQuality: "Data Quality:",
        completion: "Complete",
        improveAnalytics: "Improve Your Analytics",
        addFollowingInfo: "Add the following information to get more accurate insights:",
        updateFarmDetails: "Update Farm Details",
        comingSoon: "Coming Soon",
        featureUnderDevelopment: "This feature is currently under development. Stay tuned!"
      }
    },
    
    // Dashboard page translations
    dashboard: {
      notifications: "Notifications",
      viewAllNotifications: "View All Notifications",
      plantedArea: "Planted area",
      viewAll: "View all",
      cropsThrivingToday: "Your crops are thriving today!",
      cropHealthIndex: "Crop Health Index",
      soilMoisture: "Soil Moisture",
      ideal: "Ideal",
      temperature: "Temperature",
      sunlightExposure: "Sunlight Exposure",
      hrsPerDay: "hrs/day",
      aiCropHealthAnalysis: "AI Crop Health Analysis",
      uploadImageForAnalysis: "Upload a high-quality image of your crop for AI analysis.",
      aiQuote: "AI revolutionizes agriculture with precision farming and smart crop monitoring.",
      askAI: "Ask AI"
    },
    
    // Chatbot page translations
    chatbot: {
      title: "Digital Krishi",
      subtitle: "Your AI-powered farming assistant",
      welcomeText: "Hello! I'm here to help you with farming insights, crop recommendations, and agricultural guidance. What would you like to know?",
      inputPlaceholder: "Ask me anything about farming, crops, diseases, or upload an image...",
      popularQuestions: "Popular questions",
      tryAskingTopics: "Try asking about these topics",
      categories: {
        cropManagement: "Crop Management",
        plantHealth: "Plant Health",
        soilNutrition: "Soil & Nutrition",
        governmentSupport: "Government Support"
      },
      prompts: {
        monsoonCrops: "What crops grow best in monsoon season?",
        cropRotation: "Best crop rotation practices",
        diseaseIdentification: "How do I identify plant diseases?",
        pestControl: "Natural pest control methods",
        organicFertilizers: "Best organic fertilizers for vegetables",
        soilTesting: "How to test soil pH levels",
        farmerSchemes: "Government schemes for farmers",
        loanOptions: "Agricultural loan options"
      },
      promptLabels: {
        monsoonCrops: "Monsoon crops",
        cropRotation: "Crop rotation",
        diseaseIdentification: "Disease identification",
        pestControl: "Pest control",
        organicFertilizers: "Organic fertilizers",
        soilTesting: "Soil testing",
        farmerSchemes: "Farmer schemes",
        loanOptions: "Loan options"
      },
      footerTerms: "By messaging Digital Krishi, you agree to our",
      terms: "Terms",
      and: "and",
      privacyPolicy: "Privacy Policy",
      connecting: "Connecting...",
      connectionFailed: "Connection failed:",
      connectingToServer: "Connecting to server...",
      uploadImage: "Upload an image",
      voiceInput: "Voice input",
      clearInput: "Clear input",
      sendMessage: "Send message",
      copy: "Copy",
      like: "Like",
      dislike: "Dislike"
    },
    
    // Government Services page translations
    government: {
      title: "Government Services",
      description: "Access government schemes, subsidies, and policies for agricultural development",
      welcome: "Welcome",
      farmer: "Farmer",
      tabs: {
        schemes: "Government Schemes",
        subsidies: "Subsidies",
        policies: "Agricultural Policies",
        apply: "Apply Online",
        track: "Track Application"
      },
      schemesTitle: "Government Schemes for Farmers",
      schemesDescription: "Comprehensive list of central and state government schemes available for farmers",
      labels: {
        benefits: "Benefits",
        applicationDeadline: "Application Deadline",
        contactInformation: "Contact Information",
        helpline: "Helpline:",
        email: "Email:",
        website: "Website:",
        viewDetails: "View Details",
        eligibilityCriteria: "Eligibility Criteria",
        requiredDocuments: "Required Documents",
        applicationProcess: "Application Process",
        close: "×",
        agriculturalSubsidies: "Agricultural Subsidies",
        financialAssistance: "Financial assistance and subsidies available for farmers",
        maximumAmount: "Maximum Amount:",
        coveredEquipment: "Covered Equipment/Items:",
        eligibility: "Eligibility:",
        applicationPeriod: "Application Period:",
        applyForSubsidy: "Apply for Subsidy",
        agriculturalPolicies: "Agricultural Policies",
        nationalStatePolicies: "National and state agricultural policies affecting farmers",
        coverage: "Coverage:",
        objectives: "Objectives:",
        supportProvided: "Support Provided:",
        procurementAgencies: "Procurement Agencies:",
        focusAreas: "Focus Areas:",
        targetBeneficiaries: "Target Beneficiaries:",
        applyForSchemes: "Apply for Government Schemes",
        submitApplication: "Submit your application for various government schemes online",
        selectScheme: "Select Scheme",
        chooseScheme: "Choose a scheme",
        farmerName: "Farmer Name",
        enterFullName: "Enter your full name",
        phoneNumber: "Phone Number",
        enterPhoneNumber: "Enter your phone number",
        aadharNumber: "Aadhar Number",
        enterAadharNumber: "Enter your Aadhar number",
        farmSize: "Farm Size (in hectares)",
        enterFarmSize: "Enter farm size",
        primaryCrop: "Primary Crop",
        selectPrimaryCrop: "Select primary crop",
        bankAccountNumber: "Bank Account Number",
        enterBankAccount: "Enter your bank account number",
        address: "Address",
        enterCompleteAddress: "Enter your complete address",
        submitApplication: "Submit Application",
        trackApplications: "Track Your Applications",
        monitorStatus: "Monitor the status of your submitted applications",
        noApplicationsFound: "No Applications Found",
        noApplicationsMessage: "You haven't submitted any applications yet. Visit the Apply Online section to submit your first application.",
        trackingNumber: "Tracking Number:",
        applicationDate: "Application Date:",
        submitted: "Submitted",
        underReview: "Under Review",
        approved: "Approved",
        payment: "Payment",
        active: "Active",
        status: "Status"
      }
    },
    
    // Prediction page translations
    prediction: {
      title: "AI Prediction & Analytics",
      description: "Advanced AI-powered predictions for crop yields, weather forecasting, and market trends",
      welcome: "Welcome",
      farmer: "Farmer",
      tabs: {
        cropPrediction: "Crop Prediction",
        weatherForecast: "Weather Forecast",
        marketTrends: "Market Trends"
      },
      cropPrediction: {
        title: "AI Crop Yield Prediction",
        description: "Get accurate crop yield predictions based on advanced AI models and real-time data"
      },
      form: {
        selectCrop: "Select Crop",
        cultivationArea: "Cultivation Area (hectares)",
        season: "Season",
        soilType: "Soil Type",
        analyzing: "Analyzing Data...",
        generate: "Generate Prediction"
      }
    },
    
    // Auth pages translations
    auth: {
      signUp: {
        title: "Welcome to Digital Krishi Officer",
        subtitle: "always available, always learning, and always farmer-first",
        fullName: "Full Name",
        email: "Email Address", 
        password: "Password",
        confirmPassword: "Confirm Password",
        createAccount: "CREATE ACCOUNT",
        alreadyHaveAccount: "Already have an account?",
        signIn: "Sign In",
        back: "Back",
        welcomeMessage: "Create your account to access agricultural tools and insights",
        creatingAccount: "Creating Account..."
      },
      login: {
        title: "Welcome Back to Digital Krishi Officer",
        subtitle: "always available, always learning, and always farmer-first",
        email: "Email Address",
        password: "Password", 
        signIn: "Sign In",
        createAccount: "Create an Account",
        noAccount: "Don't have an account?",
        signUp: "Sign Up",
        back: "Back",
        welcomeMessage: "Welcome Back, Farmer!",
        dashboardMessage: "Sign in to access your agricultural dashboard",
        signingIn: "Signing In..."
      }
    }
  },
  
  ml: {
    // Navbar translations
    navbar: {
      signUp: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
      login: "ലോഗിൻ",
      language: "English" // Shows English when in Malayalam
    },
    
    // Common UI elements
    common: {
      getStarted: "ആരംഭിക്കുക",
      loading: "ലോഡുചെയ്യുന്നു...",
      signIn: "സൈൻ ഇൻ",
      signUp: "സൈൻ അപ്പ്",
      back: "തിരികെ",
      login: "ലോഗിൻ",
      logout: "ലോഗൗട്ട്",
      creatingAccount: "അക്കൗണ്ട് സൃഷ്ടിക്കുന്നു...",
      signingIn: "സൈൻ ഇൻ ചെയ്യുന്നു...",
      loginRequired: "ലോഗിൻ ആവശ്യമാണ്",
      loginRequiredMessage: "ഞങ്ങളുടെ AI സഹായിയോട് ചോദ്യങ്ങൾ ചോദിക്കാൻ ദയവായി ലോഗിൻ ചെയ്യുക."
    },
    
    // Hero Section translations  
    hero: {
      title: "കർഷക AI",
      titleItalic: "സഹായി",
      slogan: "എപ്പോഴും ലഭ്യമായ, എപ്പോഴും പഠിക്കുന്ന, എപ്പോഴും കർഷക-മുൻഗണന",
      chatPlaceholder: "കൃഷിയെക്കുറിച്ച് എന്തും ചോദിക്കുക..."
    },
    
    // Features Section translations
    features: {
      subtitle: "ഞങ്ങളുടെ സവിശേഷതകൾ",
      title: "AI അധിഷ്ഠിത കർഷക ചോദ്യങ്ങളും ഉപദേശ സംവിധാനവും",
      cards: [
        {
          title: "സ്വാഭാവിക ഭാഷാ ചോദ്യങ്ങൾ കൈകാര്യം ചെയ്യൽ",
          description: "വിളകൾ, കീടങ്ങൾ, കാലാവസ്ഥ എന്നിവയെക്കുറിച്ച് മലയാളത്തിൽ സ്വാഭാവികമായി ചോദ്യങ്ങൾ ചോദിക്കുക—AI മനസ്സിലാക്കുകയും ഉടനെ മറുപടി നൽകുകയും ചെയ്യുന്നു."
        },
        {
          title: "മൾട്ടിമോഡൽ ഇൻപുട്ടുകൾ",
          description: "രോഗബാധിതമായ വിളകളുടെ ചിത്രങ്ങൾ അപ്‌ലോഡ് ചെയ്യുക അല്ലെങ്കിൽ വേഗത്തിലുള്ള രോഗനിർണ്ണയത്തിനും ശുപാർശകൾക്കും വോയ്‌സ് നോട്ടുകൾ അയയ്ക്കുക."
        },
        {
          title: "AI അധിഷ്ഠിത വിജ്ഞാന എഞ്ചിൻ",
          description: "കൃത്യമായ ഉപദേശം നൽകാൻ പ്രാദേശിക വിള വിവരങ്ങൾ, കീട ഉപദേശങ്ങൾ, കാലാവസ്ഥാ അപ്‌ഡേറ്റുകൾ, സർക്കാർ പദ്ധതികൾ എന്നിവ ഉപയോഗിക്കുന്നു."
        },
        {
          title: "സന്ദർഭ അവബോധം",
          description: "നിങ്ങളുടെ കൃഷിഭൂമിയുടെ സ്ഥാനം, വിള തരം, സീസൺ, മുൻകാല ചരിത്രം എന്നിവയെ അടിസ്ഥാനമാക്കിയുള്ള വ്യക്തിഗത മാർഗ്ഗനിർദ്ദേശം."
        },
        {
          title: "എസ്കലേഷൻ സിസ്റ്റം",
          description: "സങ്കീർണ്ണമായ പ്രശ്‌നങ്ങൾക്ക്, ചോദ്യങ്ങൾ പ്രസക്തമായ സന്ദർഭത്തോടൊപ്പം പ്രാദേശിക കാർഷിക വിദഗ്ധരിലേക്ക് കൈമാറുന്നു."
        },
        {
          title: "തുടർച്ചയായ പഠന ലൂപ്പ്",
          description: "AI മികച്ച പ്രതികരണങ്ങൾക്കായി യഥാർത്ഥ കർഷക ചോദ്യങ്ങൾ, ഫീഡ്‌ബാക്ക്, വിദഗ്ധ ഇൻപുട്ടുകൾ എന്നിവ ഉപയോഗിച്ച് കാലക്രമേണ മെച്ചപ്പെടുന്നു."
        }
      ]
    },
    
    // More/Services section translations
    services: {
      subtitle: "ഞങ്ങളുടെ സേവനങ്ങൾ",
      title: "സ്മാർട്ട് സൊല്യൂഷനുകൾ വഴി കൃഷിയെ രൂപാന്തരപ്പെടുത്തുന്നു",
      liveChat: {
        title: "ലൈവ് ചാറ്റ്",
        description: "ലൈവ് ചാറ്റിലൂടെ തൽക്ഷണ സഹായം, പ്രീമിയം അംഗങ്ങൾക്ക് വേഗത്തിലുള്ള പ്രതികരണങ്ങൾ. ഏത് സമയത്തും നിങ്ങൾക്ക് മാർഗനിർദ്ദേശം ആവശ്യമുള്ളപ്പോൾ ഞങ്ങളുടെ കാർഷിക വിദഗ്ധരിൽ നിന്ന് ഉടനെ സഹായം നേടുക.",
        button: "ഞങ്ങളോട് ചാറ്റ് ചെയ്യുക"
      },
      emailSupport: {
        title: "ഇമെയിൽ സഹായം",
        description: "കൂടുതൽ വിശദമായ അന്വേഷണങ്ങൾക്കായി ബന്ധപ്പെടുക, ഞങ്ങൾ 24 മണിക്കൂറിനുള്ളിൽ നിങ്ങളെ ബന്ധപ്പെടും. സങ്കീർണ്ണമായ കാർഷിക ചോദ്യങ്ങൾക്കും സമഗ്ര പരിഹാരങ്ങൾക്കും അനുയോജ്യം.",
        button: "ഞങ്ങൾക്ക് എഴുതുക"
      },
      phoneSupport: {
        title: "ഫോൺ സഹായം",
        description: "പ്രീമിയം ഉപയോക്താക്കൾക്ക്, അടിയന്തിര സഹായത്തിനായി തിങ്കൾ-വെള്ളി, രാവിലെ 9 മണി മുതൽ വൈകീട്ട് 6 മണി വരെ (EST) ലഭ്യമാണ്. ഉടനടിയുള്ള പ്രശ്നപരിഹാരത്തിനും വിദഗ്ധ കൺസൾട്ടേഷനുമായി നേരിട്ടുള്ള ഫോൺ സഹായം.",
        button: "ഞങ്ങളെ വിളിക്കുക"
      }
    },
    
    // Footer translations
    footer: {
      brand: {
        title: "കൃഷിയെ ശാക്തീകരിക്കുന്നു",
        subtitle: "ഡിജിറ്റൽ നവീകരണത്തിലൂടെ",
        getStarted: "ആരംഭിക്കുക"
      },
      services: {
        title: "സേവനങ്ങൾ",
        cropPrediction: "വിള പ്രവചനം",
        reports: "റിപ്പോർട്ടുകൾ",
        governmentServices: "സർക്കാർ സേവനങ്ങൾ",
        dashboard: "ഡാഷ്ബോർഡ്"
      },
      resources: {
        title: "വിഭവങ്ങൾ",
        features: "സവിശേഷതകൾ",
        profile: "പ്രൊഫൈൽ",
        howItWorks: "ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു",
        login: "ലോഗിൻ"
      },
      copyright: "© 2024 DigKrishi. സാങ്കേതികവിദ്യയിലൂടെ കൃഷിയെ രൂപാന്തരപ്പെടുത്തുന്നു."
    },
    
    // Profile page translations
    profile: {
      title: "കർഷക പ്രൊഫൈൽ",
      subtitle: "നിങ്ങളുടെ കാർഷിക പ്രൊഫൈൽ, കൃഷിഭൂമി വിവരങ്ങൾ, അക്കൗണ്ട് സെറ്റിംഗുകൾ എന്നിവ നിയന്ത്രിക്കുക",
      welcome: "സ്വാഗതം",
      complete: "പൂർത്തിയായത്",
      loading: "നിങ്ങളുടെ പ്രൊഫൈൽ ലോഡ് ചെയ്യുന്നു...",
      loadingMessage: "ദയവായി കാത്തിരിക്കുക, ഞങ്ങൾ നിങ്ങളുടെ വിവരങ്ങൾ എടുത്ത് വരുന്നു.",
      sections: {
        personal: "വ്യക്തിഗത വിവരങ്ങൾ",
        farm: "കൃഷിഭൂമി വിവരങ്ങൾ",
        crops: "എന്റെ വിളകൾ",
        analytics: "കൃഷിഭൂമി അനലിറ്റിക്സ്",
        settings: "സെറ്റിംഗുകൾ",
        support: "സഹായവും പിന്തുണയും"
      },
      personalInfo: {
        title: "വ്യക്തിഗത വിവരങ്ങൾ",
        firstName: "പേരിന്റെ ആദ്യഭാഗം",
        lastName: "പേരിന്റെ അവസാനഭാഗം",
        email: "ഇമെയിൽ വിലാസം",
        phone: "ഫോൺ നമ്പർ",
        state: "സംസ്ഥാനം",
        city: "നഗരം",
        district: "ജില്ല (ഓപ്ഷണൽ)",
        pincode: "പിൻകോഡ്",
        age: "പ്രായം",
        gender: "ലിംഗം",
        education: "വിദ്യാഭ്യാസ നിലവാരം",
        occupation: "പ്രധാന തൊഴിൽ",
        income: "വാർഷിക വരുമാന പരിധി",
        changePhoto: "ഫോട്ടോ മാറ്റുക",
        removePhoto: "നീക്കം ചെയ്യുക",
        edit: "എഡിറ്റ് ചെയ്യുക",
        cancel: "റദ്ദാക്കുക",
        save: "മാറ്റങ്ങൾ സേവ് ചെയ്യുക",
        saving: "സേവ് ചെയ്യുന്നു..."
      },
      farmDetails: {
        title: "കൃഷിഭൂമി വിവരങ്ങൾ",
        farmName: "കൃഷിഭൂമിയുടെ പേര്",
        farmSize: "കൃഷിഭൂമിയുടെ വലുപ്പം",
        primaryCrops: "പ്രധാന വിളകൾ",
        secondaryCrops: "ദ്വിതീയ വിളകൾ (ഓപ്ഷണൽ)",
        experience: "കൃഷി അനുഭവം",
        method: "കൃഷി രീതി",
        farmState: "കൃഷിഭൂമിയുടെ സംസ്ഥാനം",
        farmCity: "കൃഷിഭൂമിയുടെ നഗരം",
        farmDistrict: "കൃഷിഭൂമിയുടെ ജില്ല (ഓപ്ഷണൽ)",
        farmPincode: "കൃഷിഭൂമിയുടെ പിൻകോഡ് (ഓപ്ഷണൽ)",
        landType: "ഭൂമിയുടെ തരം",
        soilType: "മണ്ണിന്റെ തരം",
        soilDetails: "മണ്ണിന്റെ വിവരങ്ങൾ (ഓപ്ഷണൽ എന്നാൽ ശുപാർശ ചെയ്യുന്നു)",
        waterIrrigation: "വെള്ളവും നനവും",
        infrastructure: "കൃഷിഭൂമി അടിസ്ഥാന സൗകര്യങ്ങൾ",
        equipment: "ഉപകരണങ്ങളും ഇൻപുട്ടുകളും",
        economic: "സാമ്പത്തിക വിവരങ്ങൾ",
        saveFarm: "കൃഷിഭൂമി വിവരങ്ങൾ സേവ് ചെയ്യുക"
      },
      errors: {
        serverError: "ആന്തരിക സെർവർ പിശക്",
        loadFailed: "പ്രൊഫൈൽ ഡാറ്റ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല. ദയവായി പേജ് റിഫ്രഷ് ചെയ്യുക.",
        updateFailed: "വിവരങ്ങൾ അപ്ഡേറ്റ് ചെയ്യാൻ കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
        authRequired: "നിങ്ങളുടെ പ്രൊഫൈൽ ആക്സസ് ചെയ്യാൻ ലോഗിൻ ചെയ്യേണ്ടതുണ്ട്. ദയവായി വീണ്ടും ലോഗിൻ ചെയ്യുക."
      },
      common: {
        success: "വിജയം:",
        error: "പിശക്:",
        loadingWeather: "കാലാവസ്ഥ ലോഡ് ചെയ്യുന്നു...",
        weatherUnavailable: "കാലാവസ്ഥ ലഭ്യമല്ല",
        checkConnection: "കണക്ഷൻ പരിശോധിക്കുക",
        newNotifications: "പുതിയ അറിയിപ്പുകൾ!",
        closePopup: "×",
        activeCrops: "സക്രിയ വിളകൾ",
        seasonActive: "സീസൺ സക്രിയം",
        profileComplete: "പ്രൊഫൈൽ പൂർത്തിയായി",
        noCropsSelected: "വിളകൾ തിരഞ്ഞെടുത്തില്ല",
        addFirstCrop: "+ നിങ്ങളുടെ ആദ്യ വിള ചേർക്കുക",
        noCropsAdded: "ഇന്നും വിളകൾ ചേർത്തിട്ടില്ല",
        startAddingCrops: "കൃഷിഭൂമി വിവരങ്ങൾ വിഭാഗത്തിൽ നിങ്ങളുടെ വിളകൾ ചേർത്ത് ആരംഭിക്കുക",
        loadingAnalytics: "അനലിറ്റിക്സ് ഡാറ്റ ലോഡ് ചെയ്യുന്നു...",
        noAnalyticsData: "അനലിറ്റിക്സ് ഡാറ്റ ലഭ്യമല്ല",
        completeProfileAnalytics: "വിശദമായ കൃഷിഭൂമി അനലിറ്റിക്സ് കാണാൻ നിങ്ങളുടെ പ്രൊഫൈൽ പൂർത്തിയാക്കുക",
        setupProfile: "പ്രൊഫൈൽ സെറ്റപ്പ് പൂർത്തിയാക്കുക",
        dataQuality: "ഡാറ്റ ഗുണമേന്മ:",
        completion: "പൂർത്തിയായി",
        improveAnalytics: "നിങ്ങളുടെ അനലിറ്റിക്സ് മെച്ചപ്പെടുത്തുക",
        addFollowingInfo: "കൂടുതൽ കൃത്യമായ ഉൾക്കാഴ്ചകൾ നേടാൻ ഇനിപ്പറയുന്ന വിവരങ്ങൾ ചേർക്കുക:",
        updateFarmDetails: "കൃഷിഭൂമി വിവരങ്ങൾ അപ്ഡേറ്റ് ചെയ്യുക",
        comingSoon: "വരാൻ പോകുന്നു",
        featureUnderDevelopment: "ഈ സുവിധ നിലവിൽ വികസനത്തിലാണ്. കാത്തിരിക്കുക!"
      }
    },
    
    // Dashboard page translations
    dashboard: {
      notifications: "അറിയിപ്പുകൾ",
      viewAllNotifications: "എല്ലാ അറിയിപ്പുകളും കാണുക",
      plantedArea: "നട്ടുപിടിപ്പിച്ച പ്രദേശം",
      viewAll: "എല്ലാം കാണുക",
      cropsThrivingToday: "നിങ്ങളുടെ വിളകൾ ഇന്ന് തഴച്ചുവളരുകയാണ്!",
      cropHealthIndex: "വിള ആരോഗ്യ സൂചിക",
      soilMoisture: "മണ്ണിന്റെ ഈർപ്പം",
      ideal: "അനുയോജ്യം",
      temperature: "താപനില",
      sunlightExposure: "സൂര്യപ്രകാശം",
      hrsPerDay: "മണിക്കൂർ/ദിനം",
      aiCropHealthAnalysis: "AI വിള ആരോഗ്യ വിശകലനം",
      uploadImageForAnalysis: "AI വിശകലനത്തിനായി നിങ്ങളുടെ വിളയുടെ ഉയർന്ന നിലവാരത്തിലുള്ള ചിത്രം അപ്‌ലോഡ് ചെയ്യുക.",
      aiQuote: "AI കൃത്യമായ കൃഷിയും സ്മാർട്ട് വിള നിരീക്ഷണവും ഉപയോഗിച്ച് കൃഷിയെ വിപ്ലവകാരിയാക്കുന്നു.",
      askAI: "AI യോട് ചോദിക്കുക"
    },
    
    // Chatbot page translations
    chatbot: {
      title: "ഡിജിറ്റൽ കൃഷി",
      subtitle: "നിങ്ങളുടെ AI അധിഷ്ഠിത കൃഷി സഹായി",
      welcomeText: "ഹലോ! കൃഷി ഉൾക്കാഴ്ചകൾ, വിള ശുപാർശകൾ, കാർഷിക മാർഗ്ഗനിർദ്ദേശങ്ങൾ എന്നിവയിൽ നിങ്ങളെ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്. നിങ്ങൾക്ക് എന്തറിയാൻ താൽപ്പര്യമുണ്ട്?",
      inputPlaceholder: "കൃഷി, വിളകൾ, രോഗങ്ങൾ എന്നിവയെക്കുറിച്ച് എന്തും ചോദിക്കുക അല്ലെങ്കിൽ ഒരു ചിത്രം അപ്‌ലോഡ് ചെയ്യുക...",
      popularQuestions: "ജനപ്രിയ ചോദ്യങ്ങൾ",
      tryAskingTopics: "ഈ വിഷയങ്ങളെക്കുറിച്ച് ചോദിക്കാൻ ശ്രമിക്കുക",
      categories: {
        cropManagement: "വിള നിർവ്വഹണം",
        plantHealth: "സസ്യ ആരോഗ്യം",
        soilNutrition: "മണ്ണും പോഷകാഹാരവും",
        governmentSupport: "സർക്കാർ പിന്തുണ"
      },
      prompts: {
        monsoonCrops: "മൺസൂൺ കാലത്ത് ഏതു വിളകളാണ് നന്നായി വളരുന്നത്?",
        cropRotation: "മികച്ച വിള പര്യായക്രമ രീതികൾ",
        diseaseIdentification: "സസ്യ രോഗങ്ങൾ എങ്ങനെ തിരിച്ചറിയാം?",
        pestControl: "പ്രകൃതിദത്ത കീടനിയന്ത്രണ രീതികൾ",
        organicFertilizers: "പച്ചക്കറികൾക്കുള്ള മികച്ച ജൈവ വളങ്ങൾ",
        soilTesting: "മണ്ണിന്റെ pH നില എങ്ങനെ പരിശോധിക്കാം",
        farmerSchemes: "കർഷകർക്കുള്ള സർക്കാർ പദ്ധതികൾ",
        loanOptions: "കാർഷിക വായ്പാ ഓപ്ഷനുകൾ"
      },
      promptLabels: {
        monsoonCrops: "മൺസൂൺ വിളകൾ",
        cropRotation: "വിള പര്യായക്രമം",
        diseaseIdentification: "രോഗ തിരിച്ചറിയൽ",
        pestControl: "കീട നിയന്ত്രണം",
        organicFertilizers: "ജൈവ വളങ്ങൾ",
        soilTesting: "മണ്ണ് പരിശോധന",
        farmerSchemes: "കർഷക പദ്ധതികൾ",
        loanOptions: "വായ്പാ ഓപ്ഷനുകൾ"
      },
      footerTerms: "ഡിജിറ്റൽ കൃഷിയിലേക്ക് സന്ദേശം അയയ്ക്കുന്നതിലൂടെ, നിങ്ങൾ ഞങ്ങളുടെ",
      terms: "നിബന്ധനകൾ",
      and: "ഒപ്പം",
      privacyPolicy: "സ്വകാര്യതാ നയം",
      connecting: "കണക്റ്റ് ചെയ്യുന്നു...",
      connectionFailed: "കണക്ഷൻ പരാജയപ്പെട്ടു:",
      connectingToServer: "സെർവറിലേക്ക് കണക്റ്റ് ചെയ്യുന്നു...",
      uploadImage: "ചിത്രം അപ്ലോഡ് ചെയ്യുക",
      voiceInput: "വോയ്സ് ഇൻപുട്ട്",
      clearInput: "ഇൻപുട്ട് മായ്ക്കുക",
      sendMessage: "സന്ദേശം അയയ്ക്കുക",
      copy: "പകർത്തുക",
      like: "ഇഷ്ടം",
      dislike: "ഇഷ്ടമല്ല"
    },
    
    // Government Services page translations
    government: {
      title: "സർക്കാർ സേവനങ്ങൾ",
      description: "കാർഷിക വികസനത്തിനായി സർക്കാർ പദ്ധതികൾ, സബ്സിഡികൾ, നയങ്ങൾ എന്നിവ ആക്സസ് ചെയ്യുക",
      welcome: "സ്വാഗതം",
      farmer: "കർഷകൻ",
      tabs: {
        schemes: "സർക്കാർ പദ്ധതികൾ",
        subsidies: "സബ്സിഡികൾ",
        policies: "കാർഷിക നയങ്ങൾ",
        apply: "ഓൺലൈൻ അപ്ലൈ ചെയ്യുക",
        track: "അപേക്ഷ ട്രാക്ക് ചെയ്യുക"
      },
      schemesTitle: "കർഷകർക്കുള്ള സർക്കാർ പദ്ധതികൾ",
      schemesDescription: "കർഷകർക്ക് ലഭ്യമായ കേന്ദ്ര, സംസ്ഥാന സർക്കാർ പദ്ധതികളുടെ സമഗ്ര പട്ടിക",
      labels: {
        benefits: "ആനുകൂല്യങ്ങൾ",
        applicationDeadline: "അപേക്ഷാ അവസാന തീയതി",
        contactInformation: "ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ",
        helpline: "ഹെൽപ്പ്‌ലൈൻ:",
        email: "ഇമെയിൽ:",
        website: "വെബ്സൈറ്റ്:",
        viewDetails: "വിശദാംശങ്ങൾ കാണുക",
        eligibilityCriteria: "യോഗ്യതാ മാനദണ്ഡങ്ങൾ",
        requiredDocuments: "ആവശ്യമായ രേഖകൾ",
        applicationProcess: "അപേക്ഷാ പ്രക്രിയ",
        close: "×",
        agriculturalSubsidies: "കാർഷിക സബ്സിഡികൾ",
        financialAssistance: "കർഷകർക്ക് ലഭ്യമായ സാമ്പത്തിക സഹായവും സബ്സിഡികളും",
        maximumAmount: "പരമാവധി തുക:",
        coveredEquipment: "ഉൾപ്പെടുത്തിയിരിക്കുന്ന ഉപകരണങ്ങൾ/ഇനങ്ങൾ:",
        eligibility: "യോഗ്യത:",
        applicationPeriod: "അപേക്ഷാ കാലയളവ്:",
        applyForSubsidy: "സബ്സിഡിക്ക് അപേക്ഷിക്കുക",
        agriculturalPolicies: "കാർഷിക നയങ്ങൾ",
        nationalStatePolicies: "കർഷകരെ ബാധിക്കുന്ന ദേശീയ, സംസ്ഥാന കാർഷിക നയങ്ങൾ",
        coverage: "കവറേജ്:",
        objectives: "ലക്ഷ്യങ്ങൾ:",
        supportProvided: "നൽകുന്ന പിന്തുണ:",
        procurementAgencies: "സംഭരണ ഏജൻസികൾ:",
        focusAreas: "ഫോക്കസ് മേഖലകൾ:",
        targetBeneficiaries: "ലക്ഷ്യ ഗുണഭോക്താക്കൾ:",
        applyForSchemes: "സർക്കാർ പദ്ധതികൾക്ക് അപേക്ഷിക്കുക",
        submitApplication: "വിവിധ സർക്കാർ പദ്ധതികൾക്കായി ഓൺലൈനായി നിങ്ങളുടെ അപേക്ഷ സമർപ്പിക്കുക",
        selectScheme: "പദ്ധതി തിരഞ്ഞെടുക്കുക",
        chooseScheme: "ഒരു പദ്ധതി തിരഞ്ഞെടുക്കുക",
        farmerName: "കർഷകന്റെ പേര്",
        enterFullName: "നിങ്ങളുടെ പൂർണ്ണ നാമം നൽകുക",
        phoneNumber: "ഫോൺ നമ്പർ",
        enterPhoneNumber: "നിങ്ങളുടെ ഫോൺ നമ്പർ നൽകുക",
        aadharNumber: "ആധാർ നമ്പർ",
        enterAadharNumber: "നിങ്ങളുടെ ആധാർ നമ്പർ നൽകുക",
        farmSize: "കൃഷിഭൂമിയുടെ വലുപ്പം (ഹെക്ടറിൽ)",
        enterFarmSize: "കൃഷിഭൂമിയുടെ വലുപ്പം നൽകുക",
        primaryCrop: "പ്രധാന വിള",
        selectPrimaryCrop: "പ്രധാന വിള തിരഞ്ഞെടുക്കുക",
        bankAccountNumber: "ബാങ്ക് അക്കൗണ്ട് നമ്പർ",
        enterBankAccount: "നിങ്ങളുടെ ബാങ്ക് അക്കൗണ്ട് നമ്പർ നൽകുക",
        address: "വിലാസം",
        enterCompleteAddress: "നിങ്ങളുടെ പൂർണ്ണ വിലാസം നൽകുക",
        submitApplication: "അപേക്ഷ സമർപ്പിക്കുക",
        trackApplications: "നിങ്ങളുടെ അപേക്ഷകൾ ട്രാക്ക് ചെയ്യുക",
        monitorStatus: "സമർപ്പിച്ച അപേക്ഷകളുടെ നില നിരീക്ഷിക്കുക",
        noApplicationsFound: "അപേക്ഷകൾ കണ്ടെത്തിയില്ല",
        noApplicationsMessage: "നിങ്ങൾ ഇതുവരെ അപേക്ഷകളൊന്നും സമർപ്പിച്ചിട്ടില്ല. നിങ്ങളുടെ ആദ്യ അപേക്ഷ സമർപ്പിക്കാൻ ഓൺലൈൻ അപ്ലൈ വിഭാഗം സന്ദർശിക്കുക.",
        trackingNumber: "ട്രാക്കിംഗ് നമ്പർ:",
        applicationDate: "അപേക്ഷാ തീയതി:",
        submitted: "സമർപ്പിച്ചു",
        underReview: "അവലോകനത്തിലാണ്",
        approved: "അനുമതി നൽകി",
        payment: "പേയ്മെന്റ്",
        active: "സജീവം",
        status: "നില"
      }
    },
    
    // Prediction page translations
    prediction: {
      title: "AI പ്രവചനം & അനലിറ്റിക്സ്",
      description: "വിള വിളവ്, കാലാവസ്ഥാ പ്രവചനം, മാർക്കറ്റ് ട്രെൻഡുകൾ എന്നിവയ്ക്കായുള്ള വികസിത AI അധിഷ്ഠിത പ്രവചനങ്ങൾ",
      welcome: "സ്വാഗതം",
      farmer: "കർഷകൻ",
      tabs: {
        cropPrediction: "വിള പ്രവചനം",
        weatherForecast: "കാലാവസ്ഥാ പ്രവചനം",
        marketTrends: "മാർക്കറ്റ് ട്രെൻഡുകൾ"
      },
      cropPrediction: {
        title: "AI വിള വിളവ് പ്രവചനം",
        description: "വികസിത AI മോഡലുകളും തത്സമയ ഡാറ്റയും അടിസ്ഥാനമാക്കി കൃത്യമായ വിള വിളവ് പ്രവചനങ്ങൾ നേടുക"
      },
      form: {
        selectCrop: "വിള തിരഞ്ഞെടുക്കുക",
        cultivationArea: "കൃഷി പ്രദേശം (ഹെക്ടർ)",
        season: "സീസൺ",
        soilType: "മണ്ണിന്റെ തരം",
        analyzing: "ഡാറ്റ വിശകലനം ചെയ്യുന്നു...",
        generate: "പ്രവചനം സൃഷ്ടിക്കുക"
      }
    },
    
    // Auth pages translations
    auth: {
      signUp: {
        title: "ഡിജിറ്റൽ കൃഷി ഉദ്യോഗസ്ഥനിലേക്ക് സ്വാഗതം",
        subtitle: "എപ്പോഴും ലഭ്യമായ, എപ്പോഴും പഠിക്കുന്ന, എപ്പോഴും കർഷക-മുൻഗണന",
        fullName: "പൂർണ്ണ നാമം",
        email: "ഇമെയിൽ വിലാസം",
        password: "പാസ്‌വേഡ്",
        confirmPassword: "പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
        createAccount: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
        alreadyHaveAccount: "ഇതിനകം ഒരു അക്കൗണ്ട് ഉണ്ടോ?",
        signIn: "സൈൻ ഇൻ",
        back: "തിരികെ",
        welcomeMessage: "കാർഷിക ഉപകരണങ്ങളും ഉൾക്കാഴ്ചകളും ആക്‌സസ് ചെയ്യാൻ നിങ്ങളുടെ അക്കൗണ്ട് സൃഷ്ടിക്കുക",
        creatingAccount: "അക്കൗണ്ട് സൃഷ്ടിക്കുന്നു..."
      },
      login: {
        title: "ഡിജിറ്റൽ കൃഷി ഉദ്യോഗസ്ഥനിലേക്ക് തിരികെ സ്വാഗതം",
        subtitle: "എപ്പോഴും ലഭ്യമായ, എപ്പോഴും പഠിക്കുന്ന, എപ്പോഴും കർഷക-മുൻഗണന",
        email: "ഇമെയിൽ വിലാസം",
        password: "പാസ്‌വേഡ്",
        signIn: "സൈൻ ഇൻ",
        createAccount: "ഒരു അക്കൗണ്ട് സൃഷ്ടിക്കുക",
        noAccount: "ഒരു അക്കൗണ്ട് ഇല്ലേ?",
        signUp: "സൈൻ അപ്പ്",
        back: "തിരികെ",
        welcomeMessage: "തിരികെ സ്വാഗതം, കർഷകാ!",
        dashboardMessage: "നിങ്ങളുടെ കാർഷിക ഡാഷ്ബോർഡ് ആക്‌സസ് ചെയ്യാൻ സൈൻ ഇൻ ചെയ്യുക",
        signingIn: "സൈൻ ഇൻ ചെയ്യുന്നു..."
      }
    }
  }
};
