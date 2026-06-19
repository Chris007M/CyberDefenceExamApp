// Cyber Defence Exam – Question Bank (50 questions, 2 marks each)
// This file embeds all questions so the app works without a backend server (GitHub Pages compatible)

const EXAM_QUESTIONS = [
  {
    id: 1,
    question: "What type of risk assessment is generally considered more valuable, but more difficult to obtain?",
    type: "single",
    options: ["Qualitative", "Quantitative", "ISO 31000:2012", "NIST RMF"],
    correct: [1],
    explanation: "Quantitative risk assessments assign numerical values to risk, making them more precise and valuable, but they require detailed data and are harder to produce."
  },
  {
    id: 2,
    question: "In the context of security testing, what is the Blue Team responsible for?",
    type: "single",
    options: ["Defending the organisation", "Attacking the organisation", "Reviewing the statement of work", "All of the above"],
    correct: [0],
    explanation: "The Blue Team is the defensive security team responsible for protecting the organisation from attacks."
  },
  {
    id: 3,
    question: "What are often useful drivers for justifying a business case for cybersecurity?",
    type: "single",
    options: ["Regulatory or legislative compliance", "Client/customer demand", "Response to peers and competitors", "All of the above"],
    correct: [3],
    explanation: "All listed options — compliance, client demand, and competitive pressure — are valid business case drivers for cybersecurity investment."
  },
  {
    id: 4,
    question: "What are some key areas for effective change management?",
    type: "single",
    options: ["Communication", "Engagement", "Leadership support", "All of the above"],
    correct: [3],
    explanation: "Effective change management requires communication, engagement, and leadership support — all working together."
  },
  {
    id: 5,
    question: "What type of external audit report often requires an NDA to be executed?",
    type: "single",
    options: ["SOC2 Type II", "SOC2 Type I", "ISO 27001", "All of the above"],
    correct: [0],
    explanation: "SOC2 Type II reports contain detailed operational information and typically require an NDA before being shared with third parties."
  },
  {
    id: 6,
    question: "Which of the following is a certifiable standard/framework?",
    type: "single",
    options: ["ISO/IEC 27001:2022", "ISO/IEC 27002:2022", "NIST Cyber Security Framework", "All of the above"],
    correct: [0],
    explanation: "ISO/IEC 27001:2022 is the certifiable standard. ISO 27002 provides guidance only, and NIST CSF is a voluntary framework — neither are certifiable."
  },
  {
    id: 7,
    question: "What are policies generally meant to describe?",
    type: "single",
    options: ["What", "How", "Why", "Recommendations"],
    correct: [0],
    explanation: "Policies describe 'What' an organisation must do. Procedures describe 'How' to do it, and guidelines provide recommendations."
  },
  {
    id: 8,
    question: "Who publishes the Essential Eight?",
    type: "single",
    options: ["NIST", "ACSC", "DOD", "CIA"],
    correct: [1],
    explanation: "The Australian Cyber Security Centre (ACSC) publishes the Essential Eight — a set of baseline mitigation strategies."
  },
  {
    id: 9,
    question: "Multi-factor authentication (MFA) includes which of the following factors? (Select all that apply)",
    type: "multiple",
    options: ["Something you know", "Something you are", "Something you have", "Something you wear"],
    correct: [0, 1, 2],
    explanation: "MFA factors are: Something you know (password), Something you are (biometrics), and Something you have (token). 'Something you wear' is not a standard MFA category."
  },
  {
    id: 10,
    question: "Username, password, and retina scan is considered MFA.",
    type: "truefalse",
    options: ["True", "False"],
    correct: [0],
    explanation: "True. A username/password (something you know) combined with a retina scan (something you are) constitutes multi-factor authentication."
  },
  {
    id: 11,
    question: "When should you consider writing a documented procedure?",
    type: "single",
    options: ["For all processes", "For more complex processes, where there is a possibility of error", "Never", "When you are instructed to"],
    correct: [1],
    explanation: "Procedures are most valuable for complex processes where errors are possible and consistency is critical."
  },
  {
    id: 12,
    question: "Policies should not align with strategic objectives.",
    type: "truefalse",
    options: ["True", "False"],
    correct: [1],
    explanation: "False. Policies absolutely should align with an organisation's strategic objectives to be meaningful and enforceable."
  },
  {
    id: 13,
    question: "A data breach is an example of positive risk.",
    type: "truefalse",
    options: ["True", "False"],
    correct: [1],
    explanation: "False. A data breach is a negative risk — it represents an adverse outcome that the organisation seeks to avoid or mitigate."
  },
  {
    id: 14,
    question: "When calculating risk using SLE = AV × EF, what does AV stand for?",
    type: "single",
    options: ["Attack Vector", "Asset Value", "Audio Visual", "Asset Variant"],
    correct: [1],
    explanation: "In the Single Loss Expectancy formula, AV stands for Asset Value — the monetary worth of the asset at risk."
  },
  {
    id: 15,
    question: "Risk will not be accepted if it exceeds the organisation's:",
    type: "single",
    options: ["Risk appetite", "Risk tolerance", "Risk threshold", "All of the above"],
    correct: [0],
    explanation: "Risk appetite defines the level of risk an organisation is willing to accept. Risk exceeding this threshold will not be accepted without treatment."
  },
  {
    id: 16,
    question: "What is an example of a risk framework/standard? (Select all that apply)",
    type: "multiple",
    options: ["ISO 9001:2015", "ISO 31000:2018", "ISO 27005:2022", "ISO 23301:2018"],
    correct: [1, 2],
    explanation: "ISO 31000:2018 is the risk management standard, and ISO 27005:2022 covers information security risk management. ISO 9001 is for quality, not risk."
  },
  {
    id: 17,
    question: "According to Verizon (2022), what percentage of breaches involve the human element?",
    type: "single",
    options: ["83%", "82%", "77%", "95%"],
    correct: [0],
    explanation: "Verizon's 2022 Data Breach Investigations Report found that 82% of breaches involved the human element — often cited as approximately 83%."
  },
  {
    id: 18,
    question: "Between July and December 2022, by what percentage did notifiable breaches increase according to the OAIC?",
    type: "single",
    options: ["80%", "26%", "12%", "50%"],
    correct: [1],
    explanation: "The Office of the Australian Information Commissioner (OAIC) reported a 26% increase in notifiable data breaches during this period."
  },
  {
    id: 19,
    question: "How can risk be defined? (Select all that apply)",
    type: "multiple",
    options: [
      "The effect of uncertainty on objectives",
      "The possibility that an event will adversely affect the achievement of organisational objectives",
      "The possibility of something bad happening",
      "The analysis of a potential event to then apply controls"
    ],
    correct: [0, 1, 2],
    explanation: "Risk can be defined in multiple valid ways covering uncertainty, adverse events, and probability of negative outcomes. Analysis of events to apply controls is risk treatment, not a definition."
  },
  {
    id: 20,
    question: "What is a key control in maintaining the confidentiality of data?",
    type: "single",
    options: ["Encryption", "AAA", "Zero Trust", "Vulnerability Management"],
    correct: [0],
    explanation: "Encryption is the primary technical control that protects data confidentiality by making data unreadable to unauthorised parties."
  },
  {
    id: 21,
    question: "When developing a data protection strategy, what is one of the first tasks that should be undertaken?",
    type: "single",
    options: ["Data classification", "Endpoint protection", "Data disposal", "Auditing logs"],
    correct: [0],
    explanation: "Data classification should be the first step — you must know what data you have and its sensitivity before you can protect it effectively."
  },
  {
    id: 22,
    question: "It is good practice to keep as much data as possible.",
    type: "truefalse",
    options: ["True", "False"],
    correct: [1],
    explanation: "False. Data minimisation is a best practice and a key principle in privacy frameworks. Retaining unnecessary data increases risk and regulatory exposure."
  },
  {
    id: 23,
    question: "What is the process of identifying data within an environment?",
    type: "single",
    options: ["Data Searching", "Data Discovery", "Data Protection", "AAA"],
    correct: [1],
    explanation: "Data discovery is the process of scanning and identifying where data resides within an organisation's environment."
  },
  {
    id: 24,
    question: "In Zero Trust architecture:",
    type: "single",
    options: [
      "All subjects are trusted",
      "No subject is trusted by default",
      "Some subjects are trusted by default",
      "Every second subject is trusted by default"
    ],
    correct: [1],
    explanation: "Zero Trust follows 'never trust, always verify' — no user, device, or network is trusted by default, even inside the perimeter."
  },
  {
    id: 25,
    question: "Where can someone find guidance on strengthening authentication? (Select all that apply)",
    type: "multiple",
    options: [
      "CIS Benchmark Password Policy",
      "NIST Special Publication 800-63B",
      "ISO/IEC 27001:2022",
      "NIST Cyber Security Framework"
    ],
    correct: [0, 1],
    explanation: "CIS Benchmarks and NIST SP 800-63B provide specific authentication guidance. ISO 27001 and NIST CSF are broader frameworks."
  },
  {
    id: 26,
    question: "In AAA, what is Accounting used for?",
    type: "single",
    options: [
      "Identify and validate an entity",
      "Determine what an entity has access to",
      "Monitor and capture events",
      "All of the above"
    ],
    correct: [2],
    explanation: "In AAA (Authentication, Authorisation, Accounting): Authentication identifies, Authorisation determines access, and Accounting monitors and logs events."
  },
  {
    id: 27,
    question: "A 'living off the land' attack uses:",
    type: "single",
    options: [
      "Customised tools available in security distributions such as Kali Linux",
      "Tools already available on a system such as Windows PowerShell and psexec",
      "Custom tools developed by a hacker",
      "Physical access in an office"
    ],
    correct: [1],
    explanation: "Living-off-the-land attacks use built-in system tools like PowerShell, WMI, or psexec to avoid detection by security software."
  },
  {
    id: 28,
    question: "What is a critical element of a successful cyber program?",
    type: "single",
    options: ["Leadership support", "The latest technology", "Large budgets", "A good tester"],
    correct: [0],
    explanation: "Leadership support is the single most critical element — without executive buy-in, cyber programs lack the authority, resources, and cultural backing to succeed."
  },
  {
    id: 29,
    question: "It is important to set information security objectives and targets.",
    type: "truefalse",
    options: ["True", "False"],
    correct: [0],
    explanation: "True. ISO 27001 and other frameworks require organisations to set measurable security objectives to drive improvement and demonstrate value."
  },
  {
    id: 30,
    question: "What is it typically called when the Blue Team and Red Team work collaboratively?",
    type: "single",
    options: ["Black teaming", "Gold teaming", "Green teaming", "Purple teaming"],
    correct: [3],
    explanation: "Purple teaming blends the defensive (Blue) and offensive (Red) capabilities to improve detection and response through collaboration."
  },
  {
    id: 31,
    question: "What type of SOC report is a 'point-in-time' report?",
    type: "single",
    options: ["SOC2 Type II", "SOC2 Type I", "SOC2 Type IV", "SOC3"],
    correct: [1],
    explanation: "SOC2 Type I is a point-in-time report assessing the design of controls at a specific date. SOC2 Type II covers a period of time (usually 6–12 months)."
  },
  {
    id: 32,
    question: "Champions and super users can often help with implementing change.",
    type: "truefalse",
    options: ["True", "False"],
    correct: [0],
    explanation: "True. Change champions — influential staff who advocate for and support change — are a proven technique in change management."
  },
  {
    id: 33,
    question: "What is the average dwell time in APAC for 2022 according to Mandiant?",
    type: "single",
    options: ["33 days", "16 days", "1089 days", "172 days"],
    correct: [0],
    explanation: "Mandiant's 2022 M-Trends report noted an average dwell time of 33 days in the APAC region before detection."
  },
  {
    id: 34,
    question: "An organisation can choose which risk methodology to adopt.",
    type: "truefalse",
    options: ["True", "False"],
    correct: [0],
    explanation: "True. Organisations have flexibility in selecting the risk methodology that best fits their size, industry, and maturity level."
  },
  {
    id: 35,
    question: "NIST 800-53 is a free risk management framework published by NIST.",
    type: "truefalse",
    options: ["True", "False"],
    correct: [0],
    explanation: "True. NIST SP 800-53 is freely available and provides security and privacy controls for federal information systems, though widely adopted commercially."
  },
  {
    id: 36,
    question: "The implementation of controls is often a key part of treating risk.",
    type: "truefalse",
    options: ["True", "False"],
    correct: [0],
    explanation: "True. Risk treatment typically involves applying controls (technical, administrative, or physical) to reduce the likelihood or impact of risks."
  },
  {
    id: 37,
    question: "When prioritising risk treatment, what is important to consider?",
    type: "single",
    options: ["High value assets", "Likelihood of exploitation", "Scope", "All of the above"],
    correct: [3],
    explanation: "Effective risk prioritisation considers asset value, likelihood of exploitation, and the scope of potential impact — all together."
  },
  {
    id: 38,
    question: "There are two types of controls discussed. What are they? (Choose two)",
    type: "multiple",
    options: ["Technical", "Logical", "Administrative", "Virtual"],
    correct: [0, 2],
    explanation: "The two main types of controls discussed are Technical (e.g., firewalls, encryption) and Administrative (e.g., policies, training)."
  },
  {
    id: 39,
    question: "A policy is an example of a:",
    type: "single",
    options: ["Technical control", "Administrative control", "Detective control", "Physical control"],
    correct: [1],
    explanation: "Policies are administrative controls — they set direction and expectations through documentation rather than technology or physical measures."
  },
  {
    id: 40,
    question: "What is the process of reviewing, monitoring, and reassessing your cyber program on an ongoing basis?",
    type: "single",
    options: ["Continual improvement", "Risk assessments", "Penetration testing", "Zero Trust"],
    correct: [0],
    explanation: "Continual improvement (as defined in ISO standards) is the ongoing cycle of reviewing and enhancing the cyber program over time."
  },
  {
    id: 41,
    question: "What is the primary purpose of an Incident Response Plan (IRP)?",
    type: "single",
    options: [
      "To prevent all cyber incidents from occurring",
      "To provide a structured approach for detecting, containing, and recovering from incidents",
      "To replace the need for security controls",
      "To document all vulnerabilities in the environment"
    ],
    correct: [1],
    explanation: "An IRP provides a structured, pre-planned approach to managing security incidents — from detection through to recovery and lessons learned."
  },
  {
    id: 42,
    question: "Which phase of incident response involves determining the scope and nature of a security incident?",
    type: "single",
    options: ["Preparation", "Identification", "Eradication", "Recovery"],
    correct: [1],
    explanation: "The Identification phase involves detecting and analysing the incident to understand its scope, nature, and affected systems."
  },
  {
    id: 43,
    question: "Threat intelligence can be used to proactively improve an organisation's security posture.",
    type: "truefalse",
    options: ["True", "False"],
    correct: [0],
    explanation: "True. Threat intelligence provides actionable information about adversaries, their tactics, and indicators of compromise — enabling proactive defence."
  },
  {
    id: 44,
    question: "Which of the following best describes a Business Continuity Plan (BCP)?",
    type: "single",
    options: [
      "A plan to prevent all disasters from occurring",
      "A documented strategy to ensure critical functions continue during and after a disruption",
      "A technical configuration for backup servers",
      "A marketing recovery strategy"
    ],
    correct: [1],
    explanation: "A BCP ensures that critical business functions can continue or be restored quickly in the event of a disruptive incident."
  },
  {
    id: 45,
    question: "What does RTO stand for in business continuity planning?",
    type: "single",
    options: [
      "Risk Tolerance Objective",
      "Recovery Time Objective",
      "Response Threshold Operation",
      "Resource Transfer Order"
    ],
    correct: [1],
    explanation: "Recovery Time Objective (RTO) defines the maximum acceptable time to restore a system or process after a disruption."
  },
  {
    id: 46,
    question: "Cloud security is the sole responsibility of the cloud service provider.",
    type: "truefalse",
    options: ["True", "False"],
    correct: [1],
    explanation: "False. Cloud security operates under a shared responsibility model — the provider secures the infrastructure, while the customer secures their data, configurations, and access."
  },
  {
    id: 47,
    question: "Security awareness training is an example of which type of control?",
    type: "single",
    options: ["Technical control", "Physical control", "Administrative control", "Detective control"],
    correct: [2],
    explanation: "Security awareness training is an administrative control — it addresses the human element through education rather than technology."
  },
  {
    id: 48,
    question: "Which of the following are functions in the NIST Cybersecurity Framework? (Select all that apply)",
    type: "multiple",
    options: ["Identify", "Protect", "Detect", "Eradicate"],
    correct: [0, 1, 2],
    explanation: "The NIST CSF core functions are: Identify, Protect, Detect, Respond, and Recover. 'Eradicate' is an incident response phase, not a NIST CSF function."
  },
  {
    id: 49,
    question: "What is the purpose of network segmentation in a cyber defence strategy?",
    type: "single",
    options: [
      "To increase internet speeds",
      "To limit the lateral movement of attackers and contain potential breaches",
      "To reduce the number of firewalls needed",
      "To remove the need for endpoint protection"
    ],
    correct: [1],
    explanation: "Network segmentation divides a network into zones to limit an attacker's ability to move laterally and to contain the blast radius of a breach."
  },
  {
    id: 50,
    question: "Which of the following best describes the concept of 'Defence in Depth'?",
    type: "single",
    options: [
      "Relying on a single, very strong security control",
      "Applying multiple overlapping layers of security controls so that if one fails, others remain",
      "Focusing only on perimeter defences",
      "Using only technical controls without policies"
    ],
    correct: [1],
    explanation: "Defence in Depth applies multiple, layered security controls — technical, administrative, and physical — so no single point of failure compromises the entire system."
  }
];

const TOTAL_MARKS = 100;
const MARKS_PER_Q = 2;
const PASS_MARK = 50;
const EXAM_DURATION = 60 * 60; // seconds
