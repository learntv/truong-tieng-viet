import type { Messages } from "./types";

const pagesEn: Messages["pages"] = {
  guide: {
    title: "How to use",
    steps: [
      {
        title: "Create an account",
        body: "Press **Sign in** in the top right corner, then sign up with your email or sign in quickly with a Google account. We recommend that parents create the account and learn alongside their child.",
      },
      {
        title: "Learn the alphabet",
        body: "Go to the [Alphabet](/hoc-tap/bang-chu-cai) to get to know the Vietnamese letters through pictures and sounds. Tap any letter to hear how it's pronounced.",
      },
      {
        title: "Work through the topic lessons",
        body: "In [Learn](/hoc-tap), lessons are grouped by topic and level. Your child finishes each lesson to unlock the next one and earn points.",
      },
      {
        title: "Practise speaking",
        body: "[Speaking practice](/hoc-tap/luyen-noi) uses your device's microphone so your child can practise pronunciation and get a score straight away. Allow the browser to use the microphone when asked. Voices are never recorded or stored.",
      },
      {
        title: "Follow progress",
        body: "Your child earns points and climbs the [leaderboard](/bang-xep-hang). Open the profile page to look back at achievements and the daily learning streak.",
      },
    ],
    help: "Having trouble? See the [FAQ](/cau-hoi-thuong-gap) or [contact us](/lien-he).",
  },

  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "Does Trường Tiếng Việt Của Em cost anything?",
        a: "The platform is a non-profit built to help children keep their Vietnamese. You can create an account and learn for free.",
      },
      {
        q: "What age is the platform for?",
        a: "It's designed for children, but anyone starting to learn Vietnamese can use it.",
      },
      {
        q: "What does my child need to get started?",
        a: "Just a device with a web browser and an internet connection. For speaking practice, the device needs a microphone and you'll need to allow the browser to use it when asked.",
      },
      {
        q: "Does speaking practice record my child's voice?",
        a: "No. The voice is processed right in the browser to score pronunciation and **is never recorded, stored or sent to our servers**. Find out more in our [Privacy policy](/chinh-sach-bao-mat).",
      },
      {
        q: "Do I need to sign in to learn?",
        a: "You can view some content without signing in, but you need an account to save learning progress and join the leaderboard.",
      },
      {
        q: "How do I delete my account and data?",
        a: "You can delete your account in the account settings, or contact us at [contact@cvcec.org](mailto:contact@cvcec.org).",
      },
      {
        q: "What should I do if something goes wrong or I need help?",
        a: "Visit the [Contact](/lien-he) page to send us your question. We're always happy to help you and your child.",
      },
    ],
  },

  contact: {
    title: "Contact",
    intro:
      "Trường Tiếng Việt Của Em is run by the [Canada Vietnam Cultural & Educational Council (CVCEC)](https://www.cvcec.org/). If you have questions, feedback or would like to work with us, get in touch through any of the channels below.",
    email: "Email",
    whatsapp: "WhatsApp",
    address: "Address",
    follow: "Follow us",
  },

  // The English legal text below is the organisation's own English version, as previously
  // published under the Vietnamese one on the same page.
  legal: {
    lastUpdated: (date) => `Last updated: ${date}`,
  },

  terms: {
    title: "Terms of Service",
    intro:
      'Welcome to Trường Tiếng Việt Của Em (the "Service"), operated by the **Canada Vietnam Cultural & Educational Council (CVCEC)**. By creating an account or using the Service, you (or a parent or guardian on behalf of a child) agree to the terms below. Please read them carefully before using the Service.',
    sections: [
      {
        title: "1. Who May Use the Service",
        blocks: [
          {
            p: "The Service is designed for children learning Vietnamese. Where a user is below the age at which local law permits independent consent to use an online service, account creation and use must be done by, or with the supervision and consent of, a parent or legal guardian. Parents are responsible for activity on their child's account.",
          },
        ],
      },
      {
        title: "2. Accounts",
        blocks: [
          {
            p: "You must provide accurate information when registering (email or Google sign-in). You are responsible for keeping your login credentials secure. We may suspend or terminate accounts that violate these Terms, engage in fraud, or harm the Service or other users.",
          },
          {
            p: "You may delete your account at any time using the in-app account deletion feature; this permanently removes associated data per our Privacy Policy.",
          },
        ],
      },
      {
        title: "3. User Content and Conduct",
        blocks: [
          {
            p: "When using the Service (e.g., setting a display name, uploading an avatar), you agree not to:",
          },
          {
            ul: [
              "Post obscene, violent, discriminatory, or otherwise inappropriate content.",
              "Impersonate others or provide false information.",
              "Use a child's real name, contact details, or identifiable photo as a public display name/avatar.",
              "Attempt unauthorized access, interfere with the Service, or scrape other users' data.",
            ],
          },
          {
            p: "We may remove violating content and/or suspend related accounts without prior notice.",
          },
        ],
      },
      {
        title: "4. Learning Content and Intellectual Property",
        blocks: [
          {
            p: "All lesson content, images, audio, icons, source code, and design of the Service are owned by CVCEC or its licensors and protected by copyright law. You are granted a personal, non-commercial license to use the learning content for the purpose of your (or your child's) Vietnamese learning. You may not copy, redistribute, or commercially exploit the content without written permission.",
          },
        ],
      },
      {
        title: "5. Third-Party Services",
        blocks: [
          {
            p: "The Service relies on third-party infrastructure providers (including Supabase, Cloudflare, and Google) for authentication, data storage, and speech synthesis. Use of these services is also subject to their own respective terms.",
          },
        ],
      },
      {
        title: "6. Disclaimer of Warranties",
        blocks: [
          {
            p: 'The Service is provided "as is" and "as available," without warranties of any kind, whether express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or fit for any particular purpose.',
          },
        ],
      },
      {
        title: "7. Limitation of Liability",
        blocks: [
          {
            p: "To the maximum extent permitted by law, CVCEC is not liable for any indirect, incidental, or consequential damages arising from use of, or inability to use, the Service. The Service is provided free of charge for non-profit educational purposes.",
          },
        ],
      },
      {
        title: "8. Changes to These Terms",
        blocks: [
          {
            p: 'We may update these Terms from time to time. The "last updated" date at the top of this page reflects the most recent revision. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.',
          },
        ],
      },
      {
        title: "9. Contact",
        blocks: [
          {
            p: "Questions about these Terms can be sent to: [contact@cvcec.org](mailto:contact@cvcec.org).",
          },
        ],
      },
    ],
  },

  privacy: {
    title: "Privacy Policy",
    intro:
      'Trường Tiếng Việt Của Em ("we", the "Service") is operated by the **Canada Vietnam Cultural & Educational Council (CVCEC)**. This policy explains what information we collect, how we use it and how we protect it when you or your child use our Vietnamese learning platform. The Service is aimed at children, so we keep data collection to the minimum needed and pay particular attention to children\'s privacy.',
    sections: [
      {
        title: "1. Information We Collect",
        blocks: [
          {
            p: "**Account information:** email address and (encrypted) password, or basic Google account details (display name, email, public profile photo) if you sign in with Google.",
          },
          {
            p: "**Learning profile:** display name/nickname, avatar (emoji or uploaded image), country, and learning progress (completed lessons, scores, streaks, leaderboard rank).",
          },
          {
            p: "**Speaking practice:** our speaking exercises use the device microphone for on-device speech recognition (the browser's Web Speech API) to grade pronunciation. Voice audio is processed transiently and **is never recorded, stored, or uploaded to our servers**.",
          },
          {
            p: "**Technical data:** basic technical information (browser type, error logs) to keep the Service secure and functioning.",
          },
        ],
      },
      {
        title: "2. How We Use Information",
        blocks: [
          {
            ul: [
              "Provide, maintain, and personalize the learning experience.",
              "Store and display learning progress, achievements, and leaderboards.",
              "Contact parents about the account, support requests, or policy updates.",
              "Protect the Service from fraud, abuse, and unauthorized access.",
            ],
          },
          {
            p: "We do **not** sell personal data, do not use children's data for behavioral advertising, and do not use learning data for any purpose beyond operating the Service.",
          },
        ],
      },
      {
        title: "3. Sign in with Google",
        blocks: [
          {
            p: "If you choose to sign in with Google, we only receive the basic profile information Google provides (name, email, profile photo) to create and authenticate your account. We do not access other Google data (Gmail, Drive, contacts, etc.). You can revoke this access at any time from your [Google Account permissions page](https://myaccount.google.com/permissions).",
          },
        ],
      },
      {
        title: "4. Data Storage and Security",
        blocks: [
          {
            p: "Account and progress data is stored using Supabase (database, authentication) and Cloudflare R2 (file storage such as avatars and lesson audio). We use reasonable technical safeguards (encryption in transit, row-level access controls) to protect information from unauthorized access. No method of transmission or storage is perfectly secure, and we cannot guarantee absolute security.",
          },
        ],
      },
      {
        title: "5. Children's Privacy",
        blocks: [
          {
            p: "Trường Tiếng Việt Của Em is built for children learning Vietnamese, typically with a parent or guardian involved. We:",
          },
          {
            ul: [
              "Collect only the minimum information needed for learning features (no home address, phone number, or precise location data).",
              "Do not display third-party advertising within the Service.",
              "Do not track children across other websites or apps for advertising purposes.",
              "Let a parent view, edit, or request deletion of their child's account information at any time (see Section 7).",
            ],
          },
          {
            p: "If you are a parent or guardian and believe your child has provided personal information without your consent, please contact us via Section 8 so we can investigate and delete it.",
          },
        ],
      },
      {
        title: "6. Sharing of Information",
        blocks: [
          { p: "We do not sell or rent personal data. Information is only shared with:" },
          {
            ul: [
              "Infrastructure providers (Supabase, Cloudflare, Google Cloud text-to-speech), only as needed to operate the Service.",
              "Law enforcement, if required by applicable law.",
            ],
          },
          {
            p: "Display names and scores on the **leaderboard** may be shown publicly to other users of the Service; we encourage parents not to use a child's real name as their display name.",
          },
        ],
      },
      {
        title: "7. Your Rights",
        blocks: [
          {
            ul: [
              "Access and edit profile information at any time in account settings.",
              "Request deletion of your account and associated data (an in-app account deletion feature is available).",
              "Request a copy/export of your personal data.",
              "Withdraw previously given consent at any time by contacting us.",
            ],
          },
        ],
      },
      {
        title: "8. Contact",
        blocks: [
          {
            p: "Questions about this Privacy Policy or requests to exercise the rights above can be sent to: [contact@cvcec.org](mailto:contact@cvcec.org).",
          },
        ],
      },
      {
        title: "9. Changes to This Policy",
        blocks: [
          {
            p: 'We may update this policy from time to time. The "last updated" date at the top of this page reflects the most recent revision. Material changes will be announced by email or an in-app notice.',
          },
        ],
      },
    ],
  },
};

export default pagesEn;
