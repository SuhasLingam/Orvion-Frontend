export type Week = {
  week: number;
  title: string;
  topics: string[];
};

export type Month = {
  month: number;
  title: string;
  weeks: Week[];
  assessment?: string;
};

export type ProjectSet = {
  setName: string;
  level: string;
  description: string;
  projects: string[];
};

export type Program = {
  id: string;
  title: string;
  titleHighlight: string;
  description: string;
  duration: string;
  level: string;
  mode: string;
  highlights: string[];
  technologies: string[];
  outcomes: string[];
  responsibilities: string[];
  curriculum?: Month[];
  projectsFramework?: {
    overview: string;
    stages: string[];
    sets: ProjectSet[];
    guidelines: string[];
    learningOutcomes: string[];
    conclusion: string;
  };
};

export const programs: Program[] = [
  {
    id: "ui-ux-design",
    title: "UI/UX",
    titleHighlight: "Design",
    description: "Master design thinking, user research, and industry-standard tools to craft beautiful, intuitive digital experiences.",
    duration: "12 weeks",
    level: "Beginner",
    mode: "Live Sessions",
    highlights: [
      "Live instructor-led sessions",
      "1-on-1 mentorship",
      "Real-world projects",
      "Career guidance",
    ],
    technologies: ["Figma", "FigJam", "Miro", "Adobe XD", "Notion", "HTML/CSS"],
    outcomes: [
      "Master end-to-end design workflows from research to high-fidelity prototyping",
      "Develop deep empathy for users through qualitative and quantitative research",
      "Create accessible, responsive, and platform-specific UI systems",
      "Build a professional portfolio with 3+ real-world case studies",
    ],
    responsibilities: [
      "Conduct comprehensive user research and summarize usability findings",
      "Design wireframes, mockups, and highly interactive prototypes",
      "Collaborate with engineering teams to ensure pixel-perfect handoffs",
      "Maintain and expand central design systems and component libraries",
    ],
  },
  {
    id: "devops-cloud",
    title: "DevOps &",
    titleHighlight: "Cloud",
    description: "Build, deploy, and scale modern applications with the most in-demand cloud and DevOps toolchain used in top companies.",
    duration: "16 weeks",
    level: "Intermediate",
    mode: "Live Sessions",
    highlights: [
      "Live instructor-led sessions",
      "1-on-1 mentorship",
      "Real-world projects",
      "Career guidance",
    ],
    technologies: ["AWS", "Microsoft Azure", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform", "Git"],
    outcomes: [
      "Design and deploy scalable, fault-tolerant cloud infrastructure on AWS",
      "Master Git and modern CI/CD pipelines to automate software delivery",
      "Containerize applications and orchestrate them using Kubernetes",
      "Implement Infrastructure as Code (IaC) using Terraform for reliable environments",
    ],
    responsibilities: [
      "Provision and securely manage cloud infrastructure components",
      "Monitor system health, automate backups, and optimize resource usage",
      "Resolve deployment bottlenecks in CI/CD pipeline workflows",
      "Implement container security and auto-scaling policies",
    ],
  },
  {
    id: "ai-data-science",
    title: "AI & Data",
    titleHighlight: "Science",
    description: "From data wrangling to deep learning — build real-world AI models using cutting edge frameworks and OpenAI APIs.",
    duration: "16 weeks",
    level: "Intermediate",
    mode: "Live Sessions",
    highlights: [
      "Live instructor-led sessions",
      "1-on-1 mentorship",
      "Real-world projects",
      "Career guidance",
    ],
    technologies: ["Python", "NumPy", "Pandas", "Scikit-learn", "TensorFlow", "PyTorch", "Jupyter Notebook", "OpenAI APIs"],
    outcomes: [
      "Demonstrate practical implementation of AI and Data Science concepts",
      "Develop end-to-end solutions using structured workflows",
      "Gain experience in real-world datasets and problem-solving",
      "Build professional portfolios aligned with industry expectations",
      "Acquire exposure to deployment and cloud-based environments"
    ],
    responsibilities: [
      "Clean, normalize, and pre-process massive datasets for model training",
      "Optimize existing algorithms to improve predictive accuracy and speed",
      "Develop REST endpoints to securely serve machine learning models",
      "Design dashboards to visualize training metrics and data drift",
    ],
    curriculum: [
      {
        month: 1,
        title: "Foundations",
        assessment: "Monthly Assessment 1",
        weeks: [
          {
            week: 1,
            title: "Introduction to Data Science",
            topics: ["Introduction to Data Science and AI", "Applications and industry use-cases", "Python setup (Anaconda, Jupyter)", "Basic Python syntax", "Weekly Test 1"]
          },
          {
            week: 2,
            title: "Python Programming Basics",
            topics: ["Variables, data types, operators", "Conditional statements and loops", "Functions and problem-solving", "Weekly Test 2"]
          },
          {
            week: 3,
            title: "Data Handling",
            topics: ["NumPy arrays and operations", "Pandas introduction", "DataFrames and manipulation", "Weekly Test 3"]
          },
          {
            week: 4,
            title: "Data Analysis & Visualization",
            topics: ["Data cleaning", "Handling missing values", "Visualization (Matplotlib, Seaborn)", "Exploratory Data Analysis (EDA)", "Weekly Test 4"]
          }
        ]
      },
      {
        month: 2,
        title: "Core Data Science",
        assessment: "Monthly Assessment 2",
        weeks: [
          {
            week: 5,
            title: "Statistics for Data Science",
            topics: ["Mean, median, mode", "Variance and standard deviation", "Probability basics", "Distributions", "Weekly Test 5"]
          },
          {
            week: 6,
            title: "Data Preprocessing",
            topics: ["Feature scaling", "Encoding categorical data", "Data transformation", "Weekly Test 6"]
          },
          {
            week: 7,
            title: "Introduction to Machine Learning",
            topics: ["Types of ML", "Model training and testing", "Overfitting and underfitting", "Weekly Test 7"]
          },
          {
            week: 8,
            title: "Supervised Learning",
            topics: ["Linear regression", "Logistic regression", "Evaluation metrics", "Weekly Test 8"]
          }
        ]
      },
      {
        month: 3,
        title: "Advanced Concepts & Live Project",
        assessment: "Monthly Assessment 3",
        weeks: [
          {
            week: 9,
            title: "Classification Algorithms",
            topics: ["Decision trees", "Random forest", "KNN", "Live Project Phase 1: Problem definition & dataset selection", "Weekly Test 9"]
          },
          {
            week: 10,
            title: "Unsupervised Learning",
            topics: ["K-Means clustering", "PCA", "Live Project Phase 2: Data preprocessing & feature engineering", "Weekly Test 10"]
          },
          {
            week: 11,
            title: "Natural Language Processing",
            topics: ["Text preprocessing", "Tokenization", "Sentiment analysis", "Live Project Phase 3: Model building", "Weekly Test 11"]
          },
          {
            week: 12,
            title: "Deep Learning Basics",
            topics: ["Neural networks", "TensorFlow / PyTorch basics", "Model building", "Live Project Phase 4: Model evaluation", "Weekly Test 12"]
          }
        ]
      },
      {
        month: 4,
        title: "Deployment, Placement Training & Capstone",
        weeks: [
          {
            week: 13,
            title: "Model Optimization",
            topics: ["Hyperparameter tuning", "Cross-validation", "Live Project Phase 5: Optimization & refinement", "Weekly Test 13"]
          },
          {
            week: 14,
            title: "Model Deployment",
            topics: ["Flask / FastAPI basics", "Model deployment", "Live Project Phase 6: Deployment & documentation", "Weekly Test 14"]
          },
          {
            week: 15,
            title: "Placement Training & Mini Project",
            topics: ["Resume building (AI/Data roles)", "GitHub portfolio development", "Technical interview preparation", "Aptitude & problem-solving", "Mini project", "Weekly Test 15"]
          },
          {
            week: 16,
            title: "Capstone Project & Evaluation",
            topics: ["Final project presentation", "Mock interviews (HR + Technical)", "Code review & feedback", "Performance evaluation", "Weekly Test 16"]
          }
        ]
      }
    ],
    projectsFramework: {
      overview: "As part of the AI & Data Science Internship Program, project-based learning serves as a critical component in enabling students to translate theoretical knowledge into practical application. The following project allocation framework has been designed to provide structured exposure across varying complexity levels, ensuring progressive skill development.",
      stages: [
        "Set 1 & Set 2: Foundational (Basic Level)",
        "Set 3 & Set 4: Intermediate (Medium Level)",
        "Set 5: Advanced (Industry-Level Capstone)"
      ],
      sets: [
        {
          setName: "Project Set 1",
          level: "Foundational Level (Basic – Level 1)",
          description: "This set focuses on fundamental data handling, visualization, and introductory analysis.",
          projects: [
            "Student Performance Analysis System",
            "Sales Data Visualization Dashboard",
            "Weather Data Analysis and Trend Identification",
            "Basic Movie Recommendation System (Popularity-Based)",
            "COVID-19 Data Analysis and Visualization",
            "E-Commerce Product Analysis Dashboard",
            "IPL Dataset Exploratory Data Analysis",
            "Simple Loan Data Analysis System",
            "Customer Demographics Analysis Tool",
            "Food Delivery Data Insights System",
            "Traffic Data Analysis and Visualization",
            "Basic Stock Market Trend Visualization Tool"
          ]
        },
        {
          setName: "Project Set 2",
          level: "Foundational Level (Basic – Level 2)",
          description: "This set introduces structured preprocessing and slightly deeper analytical workflows.",
          projects: [
            "House Price Prediction (Linear Regression)",
            "Student Dropout Prediction System",
            "Email Spam Detection (Basic Model)",
            "Salary Prediction Based on Experience",
            "Credit Risk Analysis System",
            "Customer Segmentation using Basic Clustering",
            "Heart Disease Prediction (Basic ML Model)",
            "Retail Sales Forecasting System",
            "Employee Attrition Prediction",
            "Insurance Claim Prediction Model",
            "Online Shopping Behavior Analysis",
            "Energy Consumption Prediction System"
          ]
        },
        {
          setName: "Project Set 3",
          level: "Intermediate Level (Medium – Level 1)",
          description: "This set emphasizes machine learning models and structured pipelines.",
          projects: [
            "Advanced House Price Prediction with Feature Engineering",
            "Customer Churn Prediction System",
            "Fraud Detection in Financial Transactions",
            "Recommendation System using Collaborative Filtering",
            "Sales Forecasting using Time Series Analysis",
            "Credit Card Default Prediction Model",
            "News Category Classification System",
            "Image Classification (Basic CNN Model)",
            "Loan Approval Prediction System (Improved Model)",
            "HR Analytics Dashboard with Predictive Insights",
            "Marketing Campaign Effectiveness Prediction",
            "Demand Forecasting System"
          ]
        },
        {
          setName: "Project Set 4",
          level: "Intermediate Level (Medium – Level 2)",
          description: "This set introduces NLP, optimization, and multi-step pipelines.",
          projects: [
            "Sentiment Analysis on Social Media Data",
            "Resume Screening System using NLP",
            "Chatbot for Student Queries (Rule-Based + ML Hybrid)",
            "Movie Recommendation System (Content-Based Filtering)",
            "Fake News Detection System",
            "Customer Feedback Analysis System",
            "Product Review Sentiment Dashboard",
            "Topic Modeling on News Articles",
            "Stock Price Prediction using LSTM (Basic Implementation)",
            "Document Classification System",
            "Email Classification System with NLP",
            "Text Summarization Tool"
          ]
        },
        {
          setName: "Project Set 5",
          level: "Advanced Level (Capstone – Industry-Oriented)",
          description: "This set represents end-to-end, deployment-ready, industry-grade solutions, integrating ML, cloud, and APIs.",
          projects: [
            "End-to-End AI-Based Job Recommendation Platform",
            "Intelligent Fraud Detection System with Real-Time Alerts",
            "AI-Powered Healthcare Diagnosis Support System",
            "Smart E-Commerce Recommendation Engine with Deployment",
            "Real-Time Sentiment Analysis Dashboard (Streaming Data)",
            "AI-Based Resume Ranking System with Deployment",
            "End-to-End MLOps Pipeline using AWS/Azure",
            "Customer 360 Analytics Platform with Dashboard",
            "AI Chatbot with NLP and API Integration",
            "Predictive Maintenance System using IoT Data",
            "Financial Market Prediction System with Dashboard",
            "Automated Data Pipeline with ML Model Deployment"
          ]
        }
      ],
      guidelines: [
        "Problem Definition and Requirement Analysis",
        "Data Collection and Preprocessing",
        "Exploratory Data Analysis and Feature Engineering",
        "Model Development and Evaluation",
        "Optimization and Validation",
        "Deployment (where applicable)",
        "Documentation and Presentation",
        "Projects in advanced stages must include cloud deployment using AWS or Microsoft Azure, ensuring real-world exposure."
      ],
      learningOutcomes: [
        "Demonstrate practical implementation of AI and Data Science concepts",
        "Develop end-to-end solutions using structured workflows",
        "Gain experience in real-world datasets and problem-solving",
        "Build professional portfolios aligned with industry expectations",
        "Acquire exposure to deployment and cloud-based environments"
      ],
      conclusion: "This project framework is designed to ensure a progressive, structured, and industry-aligned learning journey, enabling students to evolve from foundational understanding to advanced system development. The tiered project allocation ensures inclusivity for varying skill levels while maintaining a consistent pathway toward professional readiness."
    }
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    titleHighlight: "",
    description: "Learn offensive and defensive security techniques used by real security engineers to protect modern systems.",
    duration: "16 weeks",
    level: "Intermediate",
    mode: "Live Sessions",
    highlights: [
      "Live instructor-led sessions",
      "1-on-1 mentorship",
      "Real-world projects",
      "Career guidance",
    ],
    technologies: ["Splunk", "Wireshark", "Kali Linux", "Nmap", "Burp Suite", "Metasploit", "MITRE ATT&CK"],
    outcomes: [
      "Conduct comprehensive vulnerability assessments and penetration tests",
      "Monitor, detect, and respond to security incidents using Splunk SIEM",
      "Analyze network traffic and identify malicious patterns using Wireshark",
      "Implement strong defensive measures based on the MITRE ATT&CK framework",
    ],
    responsibilities: [
      "Actively monitor Splunk SIEM dashboards for anomalous behavior",
      "Perform weekly vulnerability scans and triage risk priorities",
      "Conduct post-mortem analysis on simulated security incidents",
      "Audit cloud configurations and identity access management policies",
    ],
  },
  {
    id: "quantum-computing",
    title: "Quantum",
    titleHighlight: "Computing",
    description: "Step into the future — understand quantum algorithms and build circuits using the world's leading quantum platforms.",
    duration: "12 weeks",
    level: "Advanced",
    mode: "Live Sessions",
    highlights: [
      "Live instructor-led sessions",
      "1-on-1 mentorship",
      "Real-world projects",
      "Career guidance",
    ],
    technologies: ["Qiskit", "Cirq", "PennyLane", "Python", "IBM Quantum Experience"],
    outcomes: [
      "Understand the core principles of quantum mechanics, qubits, and entanglement",
      "Design and simulate complex quantum circuits using Qiskit and IBM Quantum",
      "Implement foundational quantum algorithms like Shor's and Grover's",
      "Explore real-world quantum use cases in cryptography and optimization",
    ],
    responsibilities: [
      "Translate classical logic into efficient quantum gate sequences",
      "Run and test algorithms on cloud-based quantum hardware simulators",
      "Analyze error rates, decoherence, and noise in quantum circuits",
      "Research applications of quantum machine learning and cryptography",
    ],
  },
  {
    id: "machine-learning",
    title: "Machine",
    titleHighlight: "Learning",
    description: "Master modern machine learning algorithms, build intelligent predictive models, and deploy real-world AI applications from scratch.",
    duration: "16 weeks",
    level: "Intermediate",
    mode: "Live Sessions",
    highlights: [
      "Live instructor-led sessions",
      "1-on-1 mentorship",
      "Real-world projects",
      "Career guidance",
    ],
    technologies: ["Python", "NumPy", "Pandas", "Scikit-learn", "TensorFlow", "PyTorch", "XGBoost", "Flask/FastAPI"],
    outcomes: [
      "Demonstrate the ability to apply machine learning concepts to real-world problems",
      "Build, evaluate, and deploy advanced machine learning models",
      "Develop structured analytical workflows aligned with industry practices",
      "Enhance problem-solving skills and technical proficiency for ML engineering roles",
    ],
    responsibilities: [
      "Perform exploratory data analysis and rigorous feature engineering",
      "Train, fine-tune, and optimize supervised and unsupervised models",
      "Develop robust REST APIs to serve deployed machine learning models",
      "Establish automated end-to-end MLOps pipelines using AWS/Azure",
    ],
    curriculum: [
      {
        month: 1,
        title: "Foundations",
        assessment: "Monthly Assessment 1",
        weeks: [
          {
            week: 1,
            title: "Introduction to Machine Learning",
            topics: ["Introduction to Machine Learning and AI", "Types of ML (Supervised, Unsupervised, Reinforcement)", "Real-world applications", "Python setup (Anaconda, Jupyter Notebook)", "Weekly Test 1"]
          },
          {
            week: 2,
            title: "Python for Machine Learning",
            topics: ["Data types, loops, functions", "Libraries overview (NumPy, Pandas)", "Basic problem-solving", "Weekly Test 2"]
          },
          {
            week: 3,
            title: "Data Handling & Preprocessing",
            topics: ["Data collection and cleaning", "Handling missing values", "Data transformation", "Feature scaling", "Weekly Test 3"]
          },
          {
            week: 4,
            title: "Data Visualization & EDA",
            topics: ["Visualization (Matplotlib, Seaborn)", "Exploratory Data Analysis (EDA)", "Identifying patterns and insights", "Weekly Test 4"]
          }
        ]
      },
      {
        month: 2,
        title: "Core Machine Learning",
        assessment: "Monthly Assessment 2",
        weeks: [
          {
            week: 5,
            title: "Statistics for Machine Learning",
            topics: ["Mean, median, mode", "Variance and standard deviation", "Probability basics", "Distributions", "Weekly Test 5"]
          },
          {
            week: 6,
            title: "Supervised Learning – Regression",
            topics: ["Linear regression", "Multiple regression", "Model evaluation (MSE, RMSE, R²)", "Weekly Test 6"]
          },
          {
            week: 7,
            title: "Supervised Learning – Classification",
            topics: ["Logistic regression", "K-Nearest Neighbors (KNN)", "Decision Trees", "Weekly Test 7"]
          },
          {
            week: 8,
            title: "Advanced Classification",
            topics: ["Random Forest", "Support Vector Machines (SVM)", "Model evaluation metrics (Accuracy, Precision, Recall, F1)", "Weekly Test 8"]
          }
        ]
      },
      {
        month: 3,
        title: "Advanced Concepts & Live Project",
        assessment: "Monthly Assessment 3",
        weeks: [
          {
            week: 9,
            title: "Unsupervised Learning",
            topics: ["Clustering (K-Means)", "Hierarchical clustering", "Live Project Phase 1: Problem statement & dataset selection", "Weekly Test 9"]
          },
          {
            week: 10,
            title: "Dimensionality Reduction",
            topics: ["PCA (Principal Component Analysis)", "Feature selection techniques", "Live Project Phase 2: Data preprocessing & feature engineering", "Weekly Test 10"]
          },
          {
            week: 11,
            title: "Ensemble Learning",
            topics: ["Bagging and Boosting", "Gradient Boosting", "XGBoost basics", "Live Project Phase 3: Model building", "Weekly Test 11"]
          },
          {
            week: 12,
            title: "Introduction to Deep Learning",
            topics: ["Neural networks basics", "Activation functions", "Intro to TensorFlow / PyTorch", "Live Project Phase 4: Model evaluation & improvement", "Weekly Test 12"]
          }
        ]
      },
      {
        month: 4,
        title: "Deployment, Placement Training & Capstone",
        assessment: "Monthly Assessment 4 (Final Evaluation)",
        weeks: [
          {
            week: 13,
            title: "Model Optimization",
            topics: ["Hyperparameter tuning", "Cross-validation", "Bias vs variance", "Live Project Phase 5: Optimization & tuning", "Weekly Test 13"]
          },
          {
            week: 14,
            title: "Model Deployment",
            topics: ["Introduction to Flask / FastAPI", "Model deployment basics", "API creation for ML models", "Live Project Phase 6: Deployment & documentation", "Weekly Test 14"]
          },
          {
            week: 15,
            title: "Placement Training & Mini Project",
            topics: ["Resume building (ML roles)", "GitHub portfolio development", "Interview preparation (ML concepts + coding)", "Aptitude and problem-solving", "Mini project", "Weekly Test 15"]
          },
          {
            week: 16,
            title: "Capstone Project & Final Evaluation",
            topics: ["End-to-end ML project", "Real-world implementation", "Mock interviews (technical + HR)", "Final presentation & evaluation", "Weekly Test 16"]
          }
        ]
      }
    ],
    projectsFramework: {
      overview: "As part of the Machine Learning Internship Program, project-based learning is integrated as a core component to ensure the practical application of theoretical concepts. The structured project allocation model enables students to progressively develop competencies ranging from foundational implementation to advanced, industry-oriented system design.",
      stages: [
        "Set 1 & Set 2: Foundational (Basic Level)",
        "Set 3 & Set 4: Intermediate (Medium Level)",
        "Set 5: Advanced (Industry-Level Capstone)"
      ],
      sets: [
        {
          setName: "Project Set 1",
          level: "Foundational Level (Basic – Level 1)",
          description: "This set focuses on basic data analysis, visualization, and introductory machine learning concepts.",
          projects: [
            "Student Marks Prediction System",
            "Basic Sales Prediction using Linear Regression",
            "Student Attendance Analysis System",
            "Weather Data Trend Analysis",
            "House Rent Prediction (Simple Model)",
            "Basic Customer Data Analysis Dashboard",
            "Movie Popularity Prediction System",
            "Simple Stock Price Trend Visualization",
            "Employee Salary Analysis System",
            "Online Shopping Data Analysis",
            "Traffic Flow Prediction (Basic)",
            "Food Delivery Time Prediction (Basic Model)"
          ]
        },
        {
          setName: "Project Set 2",
          level: "Foundational Level (Basic – Level 2)",
          description: "This set introduces supervised learning models and basic classification tasks.",
          projects: [
            "House Price Prediction (Multiple Regression)",
            "Email Spam Detection System",
            "Student Dropout Prediction Model",
            "Loan Approval Prediction System",
            "Customer Segmentation using K-Means",
            "Heart Disease Prediction Model",
            "Employee Attrition Prediction",
            "Insurance Claim Prediction",
            "Credit Risk Assessment System",
            "Sales Forecasting Model",
            "Energy Consumption Prediction",
            "Product Demand Prediction"
          ]
        },
        {
          setName: "Project Set 3",
          level: "Intermediate Level (Medium – Level 1)",
          description: "This set emphasizes structured machine learning pipelines and model improvement techniques.",
          projects: [
            "Customer Churn Prediction System",
            "Fraud Detection in Banking Transactions",
            "Recommendation System using Collaborative Filtering",
            "Sales Forecasting using Time Series Models",
            "Credit Card Default Prediction",
            "News Classification System",
            "Image Classification using Basic CNN",
            "Loan Approval Prediction (Advanced Model)",
            "HR Analytics with Predictive Insights",
            "Marketing Campaign Response Prediction",
            "Demand Forecasting System",
            "Medical Diagnosis Prediction System"
          ]
        },
        {
          setName: "Project Set 4",
          level: "Intermediate Level (Medium – Level 2)",
          description: "This set introduces advanced techniques such as NLP, ensemble learning, and optimization.",
          projects: [
            "Sentiment Analysis on Product Reviews",
            "Resume Classification using NLP",
            "Chatbot for Customer Support (ML-Based)",
            "Fake News Detection System",
            "Customer Feedback Analysis Dashboard",
            "Document Classification System",
            "Email Spam Classification (Advanced Model)",
            "Stock Price Prediction using LSTM",
            "Topic Modeling System",
            "Recommendation Engine (Hybrid Model)",
            "Text Summarization System",
            "Predictive Maintenance Model"
          ]
        },
        {
          setName: "Project Set 5",
          level: "Advanced Level (Capstone – Industry-Oriented)",
          description: "This set focuses on end-to-end machine learning systems with deployment and real-world applications.",
          projects: [
            "End-to-End Customer Churn Prediction Platform with Deployment",
            "Real-Time Fraud Detection System with Alerts",
            "AI-Based Healthcare Diagnosis System",
            "Smart Recommendation Engine with API Deployment",
            "Real-Time Sentiment Analysis Dashboard",
            "AI Resume Screening and Ranking System",
            "End-to-End MLOps Pipeline using AWS/Azure",
            "Customer 360 Analytics Platform",
            "AI Chatbot with NLP and API Integration",
            "Predictive Maintenance System using IoT Data",
            "Financial Market Prediction System with Dashboard",
            "Automated Machine Learning Pipeline with Deployment"
          ]
        }
      ],
      guidelines: [
        "Follow a structured lifecycle: problem definition, data collection, preprocessing, EDA, feature engineering, model building, evaluation, optimization, and deployment.",
        "Document each stage comprehensively and present findings in a structured format.",
        "Advanced-level projects must include cloud deployment using AWS or Microsoft Azure to ensure real-world exposure."
      ],
      learningOutcomes: [
        "Apply machine learning concepts to real-world problems",
        "Gain experience in building, evaluating, and deploying models",
        "Develop structured workflows aligned with industry practices",
        "Enhance problem-solving skills, technical proficiency, and readiness for machine learning roles"
      ],
      conclusion: "This project framework ensures a structured and progressive learning pathway, enabling students to transition from foundational knowledge to advanced machine learning system development. The tiered approach supports skill enhancement at every level while maintaining a strong focus on practical exposure and employability."
    }
  },
  {
    id: "data-engineering",
    title: "Data",
    titleHighlight: "Engineering",
    description: "Master the modern data stack to design, build, and optimize scalable data pipelines, data warehouses, and big data architectures.",
    duration: "16 weeks",
    level: "Intermediate",
    mode: "Live Sessions",
    highlights: [
      "Live instructor-led sessions",
      "1-on-1 mentorship",
      "Real-world projects",
      "Career guidance",
    ],
    technologies: ["Python", "SQL", "Pandas", "Apache Spark", "Apache Airflow", "Kafka", "AWS/Azure", "Snowflake"],
    outcomes: [
      "Design and implement scalable data pipelines for structured and unstructured data",
      "Gain practical experience with large-scale distributed systems and real-time data streaming",
      "Master ETL processes, data warehousing, and complex data pipeline orchestration",
      "Build a robust portfolio showcasing end-to-end, cloud-deployed data architectures",
    ],
    responsibilities: [
      "Develop and orchestrate fault-tolerant ETL workflows using Airflow",
      "Build high-throughput big data processing pipelines utilizing PySpark and Kafka",
      "Design efficient, scalable cloud-native data lake and warehouse schemas",
      "Automate end-to-end CI/CD data flow deployments on AWS/Azure",
    ],
    curriculum: [
      {
        month: 1,
        title: "Foundations",
        assessment: "Monthly Assessment 1",
        weeks: [
          {
            week: 1,
            title: "Introduction to Data Engineering",
            topics: ["Introduction to Data Engineering and Data Ecosystem", "Roles: Data Engineer vs Data Analyst vs Data Scientist", "Basics of databases and data pipelines", "Python setup (Anaconda, Jupyter)", "Weekly Test 1"]
          },
          {
            week: 2,
            title: "Python for Data Engineering",
            topics: ["Python basics (data types, loops, functions)", "File handling (CSV, JSON)", "Working with APIs", "Weekly Test 2"]
          },
          {
            week: 3,
            title: "SQL Fundamentals",
            topics: ["Introduction to relational databases", "SQL syntax (SELECT, WHERE, ORDER BY)", "Filtering and sorting data", "Weekly Test 3"]
          },
          {
            week: 4,
            title: "Advanced SQL",
            topics: ["Joins (INNER, LEFT, RIGHT)", "Aggregations (GROUP BY, HAVING)", "Subqueries", "Weekly Test 4"]
          }
        ]
      },
      {
        month: 2,
        title: "Core Data Engineering",
        assessment: "Monthly Assessment 2",
        weeks: [
          {
            week: 5,
            title: "Data Warehousing Concepts",
            topics: ["OLTP vs OLAP", "Data warehouse architecture", "Star and snowflake schema", "Weekly Test 5"]
          },
          {
            week: 6,
            title: "ETL Fundamentals",
            topics: ["Extract, Transform, Load (ETL) concepts", "Data cleaning and transformation", "Introduction to ETL tools", "Weekly Test 6"]
          },
          {
            week: 7,
            title: "Data Processing with Python",
            topics: ["Pandas for data processing", "Handling large datasets", "Data transformation workflows", "Weekly Test 7"]
          },
          {
            week: 8,
            title: "Big Data Introduction",
            topics: ["Introduction to Big Data", "Hadoop ecosystem overview", "Spark fundamentals", "Weekly Test 8"]
          }
        ]
      },
      {
        month: 3,
        title: "Advanced Concepts & Live Project",
        assessment: "Monthly Assessment 3",
        weeks: [
          {
            week: 9,
            title: "Apache Spark",
            topics: ["Spark architecture", "PySpark basics", "DataFrames in Spark", "Live Project Phase 1: Problem statement & data source selection", "Weekly Test 9"]
          },
          {
            week: 10,
            title: "Data Pipelines",
            topics: ["Building data pipelines", "Workflow orchestration basics", "Introduction to Apache Airflow", "Live Project Phase 2: Pipeline design", "Weekly Test 10"]
          },
          {
            week: 11,
            title: "Cloud Data Engineering",
            topics: ["Introduction to cloud platforms", "Storage services (S3 / Azure Blob)", "Data processing services", "Live Project Phase 3: Cloud integration", "Weekly Test 11"]
          },
          {
            week: 12,
            title: "Data Streaming",
            topics: ["Batch vs streaming data", "Introduction to Kafka", "Real-time data processing basics", "Live Project Phase 4: Streaming integration", "Weekly Test 12"]
          }
        ]
      },
      {
        month: 4,
        title: "Deployment, Placement Training & Capstone",
        assessment: "Monthly Assessment 4 (Final Evaluation)",
        weeks: [
          {
            week: 13,
            title: "Data Pipeline Optimization",
            topics: ["Performance tuning", "Monitoring and logging", "Error handling in pipelines", "Live Project Phase 5: Optimization", "Weekly Test 13"]
          },
          {
            week: 14,
            title: "Data Engineering Deployment",
            topics: ["Deploying pipelines in cloud", "CI/CD basics for data workflows", "Documentation practices", "Live Project Phase 6: Deployment & documentation", "Weekly Test 14"]
          },
          {
            week: 15,
            title: "Placement Training & Mini Project",
            topics: ["Resume building (Data Engineering roles)", "GitHub portfolio development", "SQL & Python interview prep", "Aptitude and problem-solving", "Mini project", "Weekly Test 15"]
          },
          {
            week: 16,
            title: "Capstone Project & Final Evaluation",
            topics: ["End-to-end data pipeline project", "Real-world dataset implementation", "Mock interviews (technical + HR)", "Final presentation & evaluation", "Weekly Test 16"]
          }
        ]
      }
    ],
    projectsFramework: {
      overview: "As part of the Data Engineering Internship Program, project-based learning is a critical component designed to provide students with hands-on exposure to real-world data systems, pipelines, and scalable architectures. The objective of this framework is to ensure that students develop the ability to design, build, optimize, and deploy data workflows aligned with industry standards. The project structure follows a progressive model, categorized into five distinct sets based on complexity. The initial sets focus on foundational database operations and data handling. Intermediate sets introduce pipeline development, big data processing, and workflow orchestration. The final set consists of advanced, industry-level projects incorporating cloud platforms, streaming systems, and end-to-end deployment.",
      stages: [
        "Set 1 & Set 2: Foundational (Basic Level)",
        "Set 3 & Set 4: Intermediate (Medium Level)",
        "Set 5: Advanced (Industry-Level Capstone)"
      ],
      sets: [
        {
          setName: "Project Set 1",
          level: "Foundational Level (Basic – Level 1)",
          description: "This set focuses on basic data handling, file processing, and introductory database operations.",
          projects: [
            "Student Records Management System using CSV",
            "Sales Data Processing using Python",
            "JSON Data Parser and Analyzer",
            "Basic Log File Analyzer",
            "Employee Data Management using SQL",
            "Simple Inventory Database System",
            "Weather Data Storage and Retrieval System",
            "Customer Data Cleaning and Processing Tool",
            "File-Based Data Aggregation System",
            "Basic API Data Fetching and Storage System",
            "Transaction Data Processing System",
            "Simple Data Reporting Tool"
          ]
        },
        {
          setName: "Project Set 2",
          level: "Foundational Level (Basic – Level 2)",
          description: "This set introduces structured SQL operations, ETL concepts, and relational data workflows.",
          projects: [
            "E-Commerce Database Design and Query System",
            "Sales Data ETL Pipeline (CSV to Database)",
            "Customer Order Management System using SQL",
            "Data Cleaning and Transformation Pipeline",
            "Financial Data Processing using SQL Queries",
            "Inventory Tracking System with Database Integration",
            "API to Database Data Ingestion System",
            "Employee Payroll Data Processing Pipeline",
            "Student Analytics System using SQL Aggregations",
            "Retail Data Warehouse (Basic Star Schema)",
            "Log Data Transformation Pipeline",
            "Data Migration Tool (File to Database)"
          ]
        },
        {
          setName: "Project Set 3",
          level: "Intermediate Level (Medium – Level 1)",
          description: "This set focuses on data pipeline development, ETL workflows, and structured processing systems.",
          projects: [
            "End-to-End ETL Pipeline for Sales Data",
            "Customer Data Integration System (Multiple Sources)",
            "Data Warehouse Design for Retail Analytics",
            "Batch Data Processing Pipeline using Python",
            "SQL-Based Reporting and Analytics System",
            "Data Validation and Quality Check Pipeline",
            "Marketing Data Aggregation System",
            "Data Pipeline for Financial Transactions",
            "HR Data Processing and Analytics Pipeline",
            "Inventory Forecasting Data Pipeline",
            "Multi-Source Data Integration System",
            "Automated Data Cleaning Framework"
          ]
        },
        {
          setName: "Project Set 4",
          level: "Intermediate Level (Medium – Level 2)",
          description: "This set introduces big data tools, workflow orchestration, and distributed data processing.",
          projects: [
            "Big Data Processing using Apache Spark (Batch)",
            "Real-Time Log Processing System (Basic Streaming)",
            "Data Pipeline Orchestration using Apache Airflow",
            "ETL Pipeline using PySpark",
            "Customer Data Processing using Distributed Systems",
            "Streaming Data Pipeline using Kafka (Basic)",
            "Data Lake Design and Implementation",
            "Workflow Automation System for Data Pipelines",
            "Large-Scale Data Transformation using Spark",
            "Event-Based Data Processing System",
            "Cloud-Based Data Pipeline (Basic Implementation)",
            "Data Monitoring and Logging System"
          ]
        },
        {
          setName: "Project Set 5",
          level: "Advanced Level (Capstone – Industry-Oriented)",
          description: "This set represents end-to-end, scalable, and production-ready data engineering systems integrating cloud, streaming, and orchestration.",
          projects: [
            "End-to-End Data Pipeline with AWS/Azure Deployment",
            "Real-Time Data Streaming Pipeline using Kafka and Spark",
            "Cloud-Based Data Lake Architecture Implementation",
            "MLOps Data Pipeline for Machine Learning Systems",
            "Customer 360 Data Platform with Integrated Pipelines",
            "Financial Data Engineering System with Real-Time Processing",
            "Scalable ETL Pipeline with Airflow and Cloud Integration",
            "IoT Data Processing Pipeline (Streaming + Storage)",
            "Automated Data Warehouse with Incremental Loading",
            "Data Pipeline CI/CD Implementation",
            "Enterprise Data Engineering Platform Simulation",
            "Real-Time Analytics Dashboard Backend System"
          ]
        }
      ],
      guidelines: [
        "Follow a structured lifecycle: problem definition, data ingestion, cleaning, transformation, and storage.",
        "Perform pipeline development, validation, optimization, and deployment.",
        "Intermediate and advanced projects must incorporate Apache Spark, Apache Airflow, and Kafka.",
        "Advanced projects must include deployment on AWS or Microsoft Azure ensuring exposure to scalable, production-grade environments."
      ],
      learningOutcomes: [
        "Design and implement robust data pipelines and manage structured/unstructured large-scale data workflows",
        "Operate effectively with distributed systems and gain practical experience in ETL and real-time processing",
        "Develop proficiency in modern industry tools like Kafka, Airflow, and Spark",
        "Enhance problem-solving capabilities to build scalable data portfolios aligned with modern roles"
      ],
      conclusion: "This project allocation framework ensures a structured and progressive pathway for students to develop expertise in data engineering. By moving from foundational concepts to advanced system implementation, the program prepares students for real-world challenges and industry expectations. The integration of cloud platforms, big data tools, and real-time systems ensures that participants are equipped with relevant, future-ready skills essential for data engineering careers."
    }
  }
];

export function getProgramById(id: string): Program | undefined {
  return programs.find((p) => p.id === id);
}
