export type FaqItem = {
  id: string;
  q: string;
  a: string;
  popular?: boolean;
};

export type FaqCategory = {
  id: string;
  title: string;
  items: FaqItem[];
};

export const FAQS: FaqCategory[] = [
  {
    id: "popular",
    title: "Popular",
    items: [
      {
        id: "p1",
        q: "How do I contact Support Team?",
        a: "Email support@carsabeg.ng or use the Contact page for quick help. We aim to respond within 48 hours.",
        popular: true,
      },
      {
        id: "p2",
        q: 'What does "ads limit" mean?',
        a: "Ads limit is the maximum number of active listings a user can have in a given category or account tier — limits prevent spam and reduce duplicates.",
        popular: true,
      },
      {
        id: "p3",
        q: "How can I sell on Cars Abeg?",
        a: "Create an account, tap ‘Post ad’, choose a category, add clear photos and details, and publish. Consider a Boost plan for extra visibility.",
        popular: true,
      },
      {
        id: "p4",
        q: "How to buy something on Cars Abeg?",
        a: "Search or filter listings, contact the seller through the chat or phone, inspect the item and complete payment using secure payment partners or agreed methods.",
        popular: true,
      },
      {
        id: "p5",
        q: "How to report illegal activity on Cars Abeg?",
        a: "Use the Contact form or email support@carsabeg.ng with details and evidence; we investigate and may remove listings or suspend users.",
        popular: true,
      },
      {
        id: "p6",
        q: "What are Premium Services?",
        a: "Paid features like Boost and Top Ads that increase a listing’s exposure to more buyers for a limited time.",
        popular: true,
      },
    ],
  },

  {
    id: "general",
    title: "General Information",
    items: [
      {
        id: "g1",
        q: 'What is a "marketplace"?',
        a: "A marketplace is a platform where people list items or services and connect directly with buyers — Cars Abeg is such a marketplace for vehicles and related services.",
      },
      {
        id: "g2",
        q: "Do you have any stores?",
        a: "We are an online marketplace and do not operate retail stores. Some sellers may represent physical outlets; check the listing details for location info.",
      },
      {
        id: "g3",
        q: "Do you have delivery?",
        a: "Delivery depends on the seller. Some sellers or third-party providers offer delivery — this will be listed in the ad or arranged directly with the seller.",
      },
      {
        id: "g4",
        q: "Can I unsubscribe from the newsletter?",
        a: "Yes — use the unsubscribe link at the bottom of any marketing email or update your preferences in your account settings.",
      },
    ],
  },

  {
    id: "sellers",
    title: "For sellers",
    items: [
      {
        id: "s1",
        q: "How to fix automatic ad sharing issues on Cars Abeg?",
        a: "Check your account settings and connected social accounts. Disable and re-enable sharing or reconnect the social account in Settings to refresh tokens.",
      },
      {
        id: "s2",
        q: "I've posted my ad but I can't find it on Cars Abeg. Why?",
        a: "New ads may be moderated or placed in the queue; check your account for moderation notices, or it may be in a different category — try searching your account’s active ads.",
      },
      {
        id: "s3",
        q: "What can I do to sell better?",
        a: "Use clear photos, precise titles, accurate pricing, and detailed descriptions; respond quickly to messages and consider a Boost package to increase visibility.",
      },
      {
        id: "s4",
        q: "What does a “Verified ID” badge mean, and how can I get it?",
        a: "Verified ID confirms identity using approved documents. Upload an ID in your profile and follow verification steps; once checked, you receive the badge.",
      },
      {
        id: "s5",
        q: "How do I take a selfie that ensures successful ID verification?",
        a: "Use good lighting, hold your ID next to your face, keep the camera steady, and follow on-screen instructions; avoid glare and cropped images.",
      },
    ],
  },

  {
    id: "posting",
    title: "Posting Ad",
    items: [
      {
        id: "p01",
        q: 'What happens after I click on "Post ad"?',
        a: "Your ad is submitted for posting; depending on category it may enter moderation. After approval it becomes visible to buyers in search and category pages.",
      },
      {
        id: "p02",
        q: "Posting rules",
        a: "Follow category rules, avoid prohibited items, and provide accurate, non-misleading information. Ads that violate rules may be removed.",
      },
      {
        id: "p03",
        q: "Tips for creating an effective ad",
        a: "Use a descriptive title, fair price, clear photos, and a concise description that highlights key features and contact methods.",
      },
      {
        id: "p04",
        q: "Prohibited items on Cars Abeg",
        a: "We prohibit illegal items, counterfeit goods, and other restricted content. Check the platform rules for the full list.",
      },
      {
        id: "p05",
        q: "Managing ads",
        a: "From your account you can edit, pause, or delete listings and view performance metrics if you use paid promotions.",
      },
      {
        id: "p06",
        q: "My ad has been declined. Why?",
        a: "Declines usually happen because of missing info, prohibited content, poor photo quality, or policy violations. Check the moderation note and fix the issues before re-posting.",
      },
      {
        id: "p07",
        q: "Can I share ads on Facebook or Twitter?",
        a: "Yes — each listing has share options; make sure social sharing settings are enabled and that your post follows their rules.",
      },
      {
        id: "p08",
        q: "How long will my ads stay on Cars Abeg?",
        a: "Duration depends on category and whether you renew or use paid visibility — check the listing details or your account options.",
      },
      {
        id: "p09",
        q: "What is a “zero-priority promotion”, and how can I avoid it?",
        a: "Zero-priority typically means the ad did not meet promo requirements. Ensure your ad follows category rules, is unique, and includes required fields and quality images.",
      },
      {
        id: "p10",
        q: "Promo issues due to duplicate ads — why did this happen, and how do I fix it?",
        a: "Duplicate content or multiple similar ads can reduce promo effectiveness — merge or remove duplicates and publish one well-detailed listing.",
      },
      {
        id: "p11",
        q: "What’s “automatic ad sharing”, and how does it work?",
        a: "Automatic sharing posts your ad to linked social channels based on your account settings; enable or disable this in your profile under Sharing settings.",
      },
      {
        id: "p12",
        q: "Reasons for ad decline",
        a: "Common reasons include policy violations, low-quality images, unclear titles, disallowed items, or incorrect category selection.",
      },
      {
        id: "p13",
        q: "Title: remove repeated words",
        a: "Edit your title to remove duplicates and keep it concise so buyers can quickly see what you offer.",
      },
      {
        id: "p14",
        q: "Title: specify what you offer",
        a: "Include the make, model and key features in the title to make the ad findable and clear.",
      },
      {
        id: "p15",
        q: "Title: remove contact details",
        a: "Don’t include phone numbers or emails in the title — use the contact fields instead to keep metadata clean.",
      },
      {
        id: "p16",
        q: "Category: change to [recommended category]",
        a: "Choose the most relevant category suggested by the platform to reach the right audience for your item.",
      },
      {
        id: "p17",
        q: "Price: adjust to market range",
        a: "Research similar listings and set a competitive price; extremely high or low prices often reduce buyer interest.",
      },
      {
        id: "p18",
        q: "Description: edit to make it relevant",
        a: "Keep the description factual, list features, and avoid unrelated or promotional language.",
      },
      {
        id: "p19",
        q: "Photos: remove screenshots",
        a: "Screenshots often lower trust—use original photos showing the actual item from multiple angles.",
      },
      {
        id: "p20",
        q: "Photos: remove photos with multiple items",
        a: "Post images that clearly show only the item you are selling to avoid confusion.",
      },
      {
        id: "p21",
        q: "Photos: remove images with Carsabeg watermarks",
        a: "Avoid watermarked images as they may indicate reused or low-quality content.",
      },
      {
        id: "p22",
        q: "Photos: remove non-original images",
        a: "Use your own photos; stock or downloaded images reduce buyer trust.",
      },
      {
        id: "p23",
        q: "Photos: remove irrelevant images",
        a: "Only include images that help a buyer understand the item’s condition and features.",
      },
      {
        id: "p24",
        q: "Photos: remove contact details",
        a: "Avoid adding phone numbers or contact details on images—use the contact fields.",
      },
      {
        id: "p25",
        q: "Photos: remove price",
        a: "Don’t put prices on photos, keep pricing in the price field for clarity and search accuracy.",
      },
      {
        id: "p26",
        q: "Photos: remove low-quality photos",
        a: "Use clear, well-lit photos; low-quality images discourage buyers.",
      },
      {
        id: "p27",
        q: "Photos: used earlier",
        a: "Repeat images across different listings reduce credibility — prefer unique photos per ad.",
      },
      {
        id: "p28",
        q: "Photos: remove logos",
        a: "Logos can be misleading — show the item itself rather than branding overlays.",
      },
      {
        id: "p29",
        q: "Photos: remove inscriptions",
        a: "Text overlays or inscriptions distract from the item description and may be removed by moderation.",
      },
      {
        id: "p30",
        q: "Photos: remove nudity images",
        a: "Nudity is prohibited; ensure all images follow community guidelines.",
      },
      {
        id: "p31",
        q: "Video: replace to match the ad",
        a: "If you add video, ensure it shows the same item and features listed in the ad.",
      },
      {
        id: "p32",
        q: "Mileage: correct to actual (km)",
        a: "Always provide accurate mileage to avoid disputes and build trust with buyers.",
      },
      {
        id: "p33",
        q: "Color: correct to match the ad",
        a: "Set the correct color to avoid customer surprises and reduce returns.",
      },
      {
        id: "p34",
        q: "Duplicate: such ad already exists",
        a: "Remove duplicates or merge details into a single comprehensive listing.",
      },
      {
        id: "p35",
        q: "Prohibited: this can’t be posted on Cars Abeg",
        a: "If an item is prohibited, it will be rejected; check policy for details and alternatives.",
      },
    ],
  },

  {
    id: "prosales",
    title: "Pro Sales",
    items: [
      {
        id: "pr1",
        q: "What is \u201cPro Sales\u201d, and how does it work?",
        a: "Pro Sales is a campaign-based promotion that lets sellers bid or set budgets to increase ad visibility and attract buyers.",
      },
      {
        id: "pr2",
        q: "Whats a bid in \u201cPro Sales\u201d?",
        a: "A bid is the amount you allocate or offer to promote your listing within the Pro Sales auction or placement mechanism.",
      },
      {
        id: "pr3",
        q: "What ads are valid for \u201cPro Sales\u201d promotion?",
        a: "Eligibility depends on category and ad quality; follow the Pro Sales rules and ensure your ad meets quality and category requirements.",
      },
      {
        id: "pr4",
        q: "How do I set up and run a \u201cPro Sales\u201d campaign?",
        a: "In the promotions or Pro Sales section of your account, create a campaign, pick target ads, set budget and duration, and start the campaign.",
      },
      {
        id: "pr5",
        q: "What statistics can I see for \u201cPro Sales\u201d campaigns?",
        a: "You can typically see impressions, clicks, CTR, and budget consumption to evaluate campaign performance.",
      },
      {
        id: "pr6",
        q: "How long can I use the \u201cPro Sales\u201d feature?",
        a: "Campaign durations vary by purchase; select the duration when creating the campaign and renew as needed.",
      },
      {
        id: "pr7",
        q: "What is the difference between the promotion that I get from Boost Packages and \u201cPro Sales\u201d?",
        a: "Boost Packages are fixed visibility features while Pro Sales is campaign/bid-driven and can be more targeted and performance-based.",
      },
      {
        id: "pr8",
        q: "Can I activate the \u201cPro Sales\u201d feature without buying a Boost Package?",
        a: "Yes, Pro Sales can be used independently if you meet eligibility and campaign requirements.",
      },
      {
        id: "pr9",
        q: "Where and how does \u201cPro Sales\u201d promote my ads?",
        a: "Pro Sales placements show in promoted sections and targeted feeds, depending on campaign settings and bids.",
      },
      {
        id: "pr10",
        q: "When should I use the \u201cPro Sales\u201d feature?",
        a: "Use it when you want targeted, budget-driven promotion for specific ads or time-sensitive campaigns.",
      },
      {
        id: "pr11",
        q: "What daily budget should I choose for my campaign?",
        a: "Start small and monitor performance; increase budget when you see positive ROI and stable engagement.",
      },
      {
        id: "pr12",
        q: "How can I improve the ad’s CTR to promote it in \u201cPro Sales\u201d?",
        a: "Improve headlines, add better photos, write a focused description, and select precise categories to increase CTR.",
      },
    ],
  },

  {
    id: "premium",
    title: "Premium services",
    items: [
      {
        id: "pm1",
        q: "What are the types of Premium Services on Cars Abeg?",
        a: "Types include Boost Plans, Top Ads, and package credits — each offers different visibility and duration options.",
      },
      {
        id: "pm2",
        q: "How to buy Premium Services?",
        a: "Purchase from the Premium Services page or during listing creation and complete payment using supported payment methods.",
      },
    ],
  },

  {
    id: "buyers",
    title: "For buyers",
    items: [
      {
        id: "b1",
        q: "Should I pay before or after?",
        a: "Payment timing is agreed with the seller; we recommend using secure methods and avoiding prepayment without verification.",
      },
      {
        id: "b2",
        q: "How can I protect myself from being scammed?",
        a: "Meet sellers in public places, verify documents, use secure payment options, and be wary of unusually low prices and pressure to pay off-platform.",
      },
      {
        id: "b3",
        q: "How can I be sure that I'll get what I requested?",
        a: "Use verified sellers, review feedback, ask for inspection reports, and use third-party escrow or official payment partners when possible.",
      },
    ],
  },

  {
    id: "feedback",
    title: "Feedback",
    items: [
      {
        id: "f1",
        q: "What is ‘feedback’, and why is it important?",
        a: "Feedback is public ratings or comments left by buyers/sellers and helps others judge trustworthiness and service quality.",
      },
      {
        id: "f2",
        q: "How to leave feedback about the seller?",
        a: "After a completed transaction, use the feedback option in the order or profile to leave a rating and comments.",
      },
      {
        id: "f3",
        q: "Is there any moderation of feedback?",
        a: "We moderate feedback for abuse or illegal content; policies apply to remove or edit inappropriate entries.",
      },
      {
        id: "f4",
        q: "How can I react to feedback about sellers that other people posted?",
        a: "You can reply publicly or contact support for disputes or clarifications.",
      },
      {
        id: "f5",
        q: "Can I edit my feedback after it’s published?",
        a: "Depending on policy, you may be able to edit feedback within a limited window — check the feedback guidelines.",
      },
      {
        id: "f6",
        q: "I received negative feedback. What’s the best way to solve this?",
        a: "Respond politely, offer a resolution, and contact support if you believe the feedback is unfair.",
      },
      {
        id: "f7",
        q: "What is ‘Appeal on feedback’, and when should I use it?",
        a: "Appeals are for disputing feedback that violates rules; provide evidence and we will review it.",
      },
    ],
  },

  {
    id: "jobs",
    title: "Jobs & Services",
    items: [
      {
        id: "j1",
        q: "How to find a job on Cars Abeg?",
        a: "Browse the Jobs section, use filters, set alerts, and apply to listings with a tailored CV and cover note.",
      },
      {
        id: "j2",
        q: "How to find good candidates for jobs on Cars Abeg?",
        a: "Use targeted job postings, clear role descriptions, and respond promptly to applicants to increase response rates.",
      },
    ],
  },

  {
    id: "Cars Abeg",
    title: "Cars Abeg",
    items: [
      {
        id: "c1",
        q: "What are the benefits of selling my car with Cars Abeg?",
        a: "Cars Abeg offers inspections, auction exposure, and assistance with paperwork for a streamlined selling experience.",
      },
      {
        id: "c2",
        q: "How does the auction work?",
        a: "Auctions allow dealers and buyers to place bids within a timeframe; winner pays and collects the vehicle per auction rules.",
      },
      {
        id: "c3",
        q: "How to prepare for a car inspection?",
        a: "Bring ID, service records and clean the vehicle; be ready to allow inspection of key components.",
      },
      {
        id: "c4",
        q: "How do I ensure I get the best price for my car?",
        a: "Present accurate details, provide good photos, be realistic about pricing, and consider inspection or minor fixes before sale.",
      },
      {
        id: "c5",
        q: "Will you ensure the confidentiality of my personal information?",
        a: "We treat personal information with care according to our Privacy Policy and only share it with authorised partners when necessary.",
      },
      {
        id: "c6",
        q: "Where are Cars Abeg Inspection Centres located?",
        a: "Inspection centre locations are listed on the Cars Abeg service pages; check the Cars Abeg section for details.",
      },
      {
        id: "c7",
        q: "What do I do if the inspection report turns out to be non-exhaustive?",
        a: "Contact the inspection provider and our support team so we can help review and address the issue.",
      },
    ],
  },

  {
    id: "inspection",
    title: "Cars Inspection",
    items: [
      {
        id: "ci1",
        q: "How do I book a car inspection?",
        a: "Use the Book Inspection option on the listing or inspection section, select a slot and confirm your booking.",
      },
      {
        id: "ci2",
        q: "Must I book an appointment at the inspection center?",
        a: "Appointments ensure timely service; walk-ins might be accepted but availability is not guaranteed.",
      },
      {
        id: "ci3",
        q: "What documents should I bring for inspection?",
        a: "Bring a valid ID, vehicle documents, and any service history relevant to the vehicle.",
      },
    ],
  },
];
