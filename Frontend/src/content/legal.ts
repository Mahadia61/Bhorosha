export interface LegalSection {
  heading: string
  body: string[]
}

export const LEGAL_UPDATED = 'Last updated: August 2026'

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: '1. Who can use Bhorosha',
    body: [
      'Bhorosha is available only to current students and teachers of CUET (Chittagong University of Engineering & Technology) with a valid official university email address ending in @student.cuet.ac.bd or @teacher.cuet.ac.bd.',
      'Administrator accounts are pre-provisioned by the Bhorosha team and are not available through self-signup.',
    ],
  },
  {
    heading: '2. Your account',
    body: [
      'You are responsible for keeping your password confidential and for all activity that happens under your account.',
      'You must verify your account using the code sent to your university email before you can sign in.',
      'You may not share your account, impersonate another person, or create an account on behalf of someone else.',
    ],
  },
  {
    heading: '3. Reviews and content you post',
    body: [
      'Reviews, ratings, and questions must relate to your genuine experience as a student or teacher at CUET.',
      'You may choose to post a review or question anonymously. When you do, your name is hidden from other students, teachers, and administrators.',
      'Content that is defamatory, harassing, discriminatory, or that discloses another person\u2019s private information is not allowed and may be removed by our moderation team.',
      'We reserve the right to remove content, or suspend an account, that violates these terms.',
    ],
  },
  {
    heading: '4. Moderation',
    body: [
      'Submissions may be reviewed by a dedicated admin team before or after publication to keep the platform constructive and spam-free.',
      'Moderation decisions can be appealed by contacting the Bhorosha team through your department administrator.',
    ],
  },
  {
    heading: '5. Changes to these terms',
    body: [
      'We may update these Terms of Service from time to time. If we make material changes, we will let you know before they take effect.',
    ],
  },
]

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: '1. What we collect',
    body: [
      'Account information: your name, university email address, role (student or teacher), and department.',
      'Content you submit: reviews, ratings, questions, and answers, along with whether you chose to post them anonymously.',
      'Basic usage information needed to keep the platform secure and working correctly.',
    ],
  },
  {
    heading: '2. How anonymity works',
    body: [
      'When you post anonymously, your name and identifying details are not shown to other students, teachers, or administrators alongside that content.',
      'Your account information is still associated with your submission internally, so that our moderation team can enforce these policies and respond to abuse reports — it is never displayed publicly.',
    ],
  },
  {
    heading: '3. How we use your information',
    body: [
      'To operate and improve Bhorosha, including showing aggregated, anonymized rating trends to teachers.',
      'To verify that accounts belong to genuine CUET students and teachers.',
      'To moderate content and investigate reports of misuse.',
    ],
  },
  {
    heading: '4. What we never do',
    body: [
      'We do not sell your personal information.',
      'We do not reveal the identity behind an anonymous review or question to teachers, other students, or the public.',
      'We do not share individual-level rating data with teachers — only aggregated trends across a course or semester.',
    ],
  },
  {
    heading: '5. Your choices',
    body: [
      'You can choose whether each review or question you post is anonymous or attributed to your name.',
      'You can update your profile information or request account deletion at any time from your profile settings.',
    ],
  },
]
