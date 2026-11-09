export interface CourseOptionEn { text: string; isCorrect: boolean; feedback: string; }
export interface CourseCaseEn { title: string; narrative: string; question: string; options: CourseOptionEn[]; }
export interface CourseTranslation {
  title: string;
  description: string;
  concept: string;
  expertTip: string;
  cases: CourseCaseEn[];
}

/** Traducciones al inglés de los cursos (por id). Los cursos sin entrada se muestran en español. */
export const COURSES_EN: { [id: number]: CourseTranslation } = {
        1: {
          title: 'Daily Phishing',
          description: 'Forensic analysis of spoofing vectors, email social engineering, and SMTP domain validation.',
          concept: 'Phishing attacks leverage psychological manipulation and forged email headers (DKIM/SPF bypass attempts) to deceive users into disclosing corporate credentials or executing malicious payloads disguised as routine attachments.',
          expertTip: 'Always inspect the complete Internet Message Format headers (`Authentication-Results`) to verify if the Return-Path aligns precisely with the domain claimed by the supposed sender organisation.',
          cases: [
            {
              title: 'The Urgent Bank Alert',
              narrative: 'You receive an urgent notification purporting to be from your corporate banking provider, stating that suspicious login attempts require immediate account password resetting via an external link.',
              question: 'What is the safest architectural verification step?',
              options: [
                { text: 'Follow the embedded short-link to verify credentials.', isCorrect: false, feedback: 'Incorrect. This redirects directly to an adversary-in-the-middle harvesting portal.' },
                { text: 'Manually navigate to the secure banking domain by typing the official URL.', isCorrect: true, feedback: 'Correct! Manual navigation prevents URL spoofing and credential leakage.' },
                { text: 'Forward the email to public forums to ask if it is valid.', isCorrect: false, feedback: 'Incorrect. This risks leaking internal organizational telemetry.' }
              ]
            },
            {
              title: 'The Invoicing Trap',
              narrative: 'An email arrives with an attachment named "Invoice_Final.pdf.exe" from a known vendor requesting immediate wire transfer verification.',
              question: 'Why is this attachment structure critical to flag?',
              options: [
                { text: 'It uses a double extension exploit to conceal executable malware code.', isCorrect: true, feedback: 'Correct! Double extensions trick users into executing binaries.' },
                { text: 'PDF files are inherently dangerous and always corrupted.', isCorrect: false, feedback: 'Incorrect. Standard PDFs are safe; the risk is the hidden .exe extension.' },
                { text: 'It is completely safe if opened inside a web browser tab.', isCorrect: false, feedback: 'Incorrect. Executables can trigger device-level compromise.' }
              ]
            }
          ]
        },
        2: {
          title: 'Secure Passwords',
          description: 'Entropy architecture, dictionary attack mitigation, and Credential Stuffing protection.',
          concept: 'Password security depends mathematically on cryptographic entropy (length combined with character space diversity) and organizational segregation to prevent widespread exposure during third-party data breaches.',
          expertTip: 'Deploy hardware-backed password managers enforcing minimum 16-character keys combined with FIDO2 WebAuthn multi-factor tokens.',
          cases: [
            {
              title: 'The Reused Credential Breach',
              narrative: 'An online discussion forum where you hold an inactive account suffers a database dump exposing hashed passwords.',
              question: 'How do automated bots exploit credential reuse?',
              options: [
                { text: 'They execute brute-force attacks directly against your local device RAM.', isCorrect: false, feedback: 'Incorrect. Attacks target remote target authentication endpoints.' },
                { text: 'They execute Credential Stuffing across high-value services using the leaked pair.', isCorrect: true, feedback: 'Correct! Bots rapidly test stolen user/password pairs on banking and email platforms.' },
                { text: 'They automatically format your smartphone storage partition.', isCorrect: false, feedback: 'Incorrect. Database leaks do not possess device formatting capabilities.' }
              ]
            },
            {
              title: 'Constructing Memorable Entropy',
              narrative: 'You need to establish a master password for a secure system without writing it down on physical paper.',
              question: 'Which strategy yields superior cryptographic strength?',
              options: [
                { text: 'Using your pet name combined with your birth year.', isCorrect: false, feedback: 'Incorrect. Easily vulnerable to personal-data dictionary matching.' },
                { text: 'A passphrase composed of four or more randomized dictionary words with separators.', isCorrect: true, feedback: 'Correct! High length and word diversity create massive resistance against brute-forcing.' },
                { text: 'A simple sequential string like "Password123".', isCorrect: false, feedback: 'Incorrect. Found instantly in any basic password guessing dictionary.' }
              ]
            }
          ]
        },
        3: {
          title: 'Social Engineering',
          description: 'Behavioral analysis of psychological manipulation, cognitive biases, and malicious persuasion.',
          concept: 'Social engineering bypasses technological perimeters by manipulating human heuristics such as compliance, fear of authority, and urgency, coercing targets into administrative or data bypasses.',
          expertTip: 'Implement strict Out-of-Band (OOB) verbal confirmation policies for any financial or credential modification request.',
          cases: [
            {
              title: 'The Executive Impersonation',
              narrative: 'You receive an urgent message on an unverified messaging app from the company CEO demanding immediate disclosure of sensitive system administrator tokens for an emergency audit.',
              question: 'How should this request be handled procedurally?',
              options: [
                { text: 'Comply immediately since executives hold overriding authority.', isCorrect: false, feedback: 'Incorrect. Executives follow security policies and never request credentials via chat.' },
                { text: 'Disregard the channel and verify identity via official corporate video or phone channels.', isCorrect: true, feedback: 'Correct! Independent channel verification thwarts impersonation tactics.' },
                { text: 'Send the tokens with a password protection layer.', isCorrect: false, feedback: 'Incorrect. Tokens should never be shared outside secure vault systems.' }
              ]
            }
          ]
        },
        4: {
          title: 'Malware & Downloads',
          description: 'Infection vector analysis via malicious executables, trojans, ransomware, and fake installers.',
          concept: 'Malware delivery mechanisms often exploit unpatched software vulnerabilities, cracked software bundles, or malicious macro-enabled documents to achieve persistence and lateral network movement.',
          expertTip: 'Enforce Endpoint Detection and Response (EDR) solutions and block execution of macros originating from internet zones.',
          cases: [
            {
              title: 'The Cracked Utility Package',
              narrative: 'A colleague downloads an unregistered version of professional software from an unverified torrent directory to bypass licensing fees.',
              question: 'What hidden risk accompanies this executable package?',
              options: [
                { text: 'It frequently embeds infostealers, cryptominers, or ransomware backdoors.', isCorrect: true, feedback: 'Correct! Unofficial software modifications are primary distribution vectors for malware.' },
                { text: 'It will automatically upgrade your internet bandwidth capacity.', isCorrect: false, feedback: 'Incorrect. Cracks contain malicious code, not performance enhancements.' },
                { text: 'There is no risk if the file size is small.', isCorrect: false, feedback: 'Incorrect. Payloads can be compact and heavily obfuscated.' }
              ]
            }
          ]
        },
        5: {
          title: 'Public Wi-Fi Networks',
          description: 'Analysis of Man-in-the-Middle attacks, hotspot spoofing, and wireless link encryption.',
          concept: 'Unencrypted public access points allow malicious actors to perform ARP poisoning, DNS spoofing, and packet sniffing to intercept cleartext sessions and sensitive payloads.',
          expertTip: 'Mandate corporate Virtual Private Network (VPN) encapsulation or ensure zero-trust TLS encryption across all application traffic layers.',
          cases: [
            {
              title: 'The Unsecured Hotspot',
              narrative: 'While waiting at a cafe, you connect to an open wireless network with no encryption key to check financial transactions.',
              question: 'What exposure level does this create for your data stream?',
              options: [
                { text: 'Total exposure to Man-in-the-Middle (MitM) traffic inspection and session hijacking.', isCorrect: true, feedback: 'Correct! Unencrypted public links permit packet sniffing and interception.' },
                { text: 'Enhanced connection speed due to open gateway routing.', isCorrect: false, feedback: 'Incorrect. Open networks do not improve cryptographic performance.' },
                { text: 'Absolute hardware immunity against viruses.', isCorrect: false, feedback: 'Incorrect. Network exposure is independent of local virus immunity.' }
              ]
            }
          ]
        },
        6: {
          title: 'Two-Factor Auth (2FA)',
          description: 'Multi-factor authentication architecture, phishing resistance, and interception mitigation.',
          concept: 'Multi-Factor Authentication requires combining independent verification categories (knowledge, possession, inheritance). Phishing-resistant FIDO2 hardware keys provide superior security over interceptable SMS vectors.',
          expertTip: 'Transition away from SMS-based OTPs to app authenticators or physical security tokens to neutralize SIM-swapping risks.',
          cases: [
            {
              title: 'Choosing the 2FA Mechanism',
              narrative: 'You are configuring account security and must choose between SMS text message verification codes or a dedicated authenticator application.',
              question: 'Why are SMS verification codes considered vulnerable to sophisticated threats?',
              options: [
                { text: 'They can be intercepted via telecom SS7 routing flaws or SIM-swapping attacks.', isCorrect: true, feedback: 'Correct! Telecom vulnerabilities allow attackers to hijack phone numbers.' },
                { text: 'SMS codes require a physical internet router in your home.', isCorrect: false, feedback: 'Incorrect. SMS travels through cellular carrier networks.' },
                { text: 'They make the user interface run significantly slower.', isCorrect: false, feedback: 'Incorrect. Performance impact is nonexistent.' }
              ]
            }
          ]
        }
};
