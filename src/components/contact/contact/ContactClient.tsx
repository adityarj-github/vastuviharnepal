"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { Contact as ContactData } from "@/data/contact";
import { ActionButton, FlipButton } from "@/components/buttons";
import { ContactBreadcrumb } from "../shared/ContactBreadcrumb";
import styles from "./Contact.module.css";

interface ContactClientProps {
  contacts: ContactData[];
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7.2 3.5 4.6 4.7a2 2 0 0 0-1.1 2.1 16.2 16.2 0 0 0 13.7 13.7 2 2 0 0 0 2.1-1.1l1.2-2.6-4.1-2.4-2.1 2.1a13 13 0 0 1-6.1-6.1l2.1-2.1-2.4-4.1Z" />
      <path d="M14 4a6 6 0 0 1 6 6M14 7a3 3 0 0 1 3 3" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3.5 6 8.5 6.5L20.5 6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-9.5A7.5 7.5 0 0 1 10.5 4H12a8 8 0 0 1 8 7.5Z" />
    </svg>
  );
}

function ContactTile({
  icon,
  className,
  children,
}: {
  icon: "phone" | "email" | "location";
  className?: string;
  children: ReactNode;
}) {
  const Icon = icon === "phone" ? PhoneIcon : icon === "email" ? EnvelopeIcon : PinIcon;

  return (
    <article className={`${styles.contactTile} ${className ?? ""}`}>
      <span className={styles.tileIcon}><Icon /></span>
      <div className={styles.tileContent}>{children}</div>
    </article>
  );
}

export function ContactClient({ contacts }: ContactClientProps) {
  const contact = contacts[0];
  const [messageStatus, setMessageStatus] = useState("");

  if (!contact) return null;

  const mapQuery = encodeURIComponent(contact.coordinates);
  const mapUrl = `https://maps.google.com/maps?q=${mapQuery}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

  function sendEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const subject = encodeURIComponent(`Website enquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`,
    );

    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    setMessageStatus("Your email app should open with your message ready to send.");
  }

  const phoneLinks = contact.phones.map((phone) => ({
    phone,
    href: `tel:${phone.replace(/[^+\d]/g, "")}`,
  }));

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="page-title">
        <div className={styles.heroInner}>
          <h1 id="page-title">Get in touch</h1>
          <ContactBreadcrumb current="Get in touch" />
        </div>
      </section>

      <div className={styles.contentPanel}>
        <div className={styles.container}>
        <section className={styles.topSection} aria-labelledby="contact-title">
          <div className={styles.contactLead}>
            <div className={styles.heading}>
              <h2 id="contact-title">Submit your enquiries</h2>
              <p className={styles.introText}>
                Have a question, project inquiry, or need assistance?<br className={styles.desktopBreak} />
                We’re here to help.
              </p>
            </div>

            <form className={styles.messageForm} onSubmit={sendEnquiry}>
              <label className={styles.visuallyHidden} htmlFor="contact-name">Your name</label>
              <div className={styles.inputWrap}>
                <UserIcon />
                <input id="contact-name" name="name" placeholder="Your Name" autoComplete="name" required />
              </div>

              <label className={styles.visuallyHidden} htmlFor="contact-phone">Phone number</label>
              <div className={styles.inputWrap}>
                <PhoneIcon />
                <input id="contact-phone" name="phone" type="tel" placeholder="Phone Number" autoComplete="tel" required />
              </div>

              <label className={styles.visuallyHidden} htmlFor="contact-email">Email address</label>
              <div className={`${styles.inputWrap} ${styles.emailWrap}`}>
                <EnvelopeIcon />
                <input id="contact-email" name="email" type="email" placeholder="Email Address" autoComplete="email" required />
              </div>

              <label className={styles.visuallyHidden} htmlFor="contact-message">Your message</label>
              <div className={`${styles.inputWrap} ${styles.messageWrap}`}>
                <MessageIcon />
                <textarea id="contact-message" name="message" placeholder="Your Message" required />
              </div>

              <ActionButton
                className={styles.sendButton}
                text="Send Message"
                type="submit"
              />
              <p className={styles.formStatus} role="status">{messageStatus}</p>
            </form>

            <div className={styles.formCtas} aria-label="More contact options">
              <article className={styles.formCta}>
                <span className={styles.ctaMeta}><span>Site</span><span>Project contacts</span></span>
                <span className={styles.ctaTitle}>Site Contact</span>
                <span className={styles.ctaDescription}>Get in touch with our project site teams.</span>
                <FlipButton className={styles.ctaAction} text="Learn more" href="/contact/site" />
              </article>
              <article className={styles.formCta}>
                <span className={styles.ctaMeta}><span>Branch</span><span>Office contacts</span></span>
                <span className={styles.ctaTitle}>Branch Contact</span>
                <span className={styles.ctaDescription}>Find your nearest branch office contacts.</span>
                <FlipButton className={styles.ctaAction} text="Learn more" href="/contact/branch" />
              </article>
            </div>
          </div>

          <div className={styles.mapColumn}>
            <iframe
              title="Map showing the Birtamode contact office"
              src={mapUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <aside className={styles.mapCard}>
              <p className={styles.mapEyebrow}>Our location <span /></p>
              <h2>Birtamode Office</h2>
              <p className={styles.mapAddress}><PinIcon />{contact.address}</p>
              <ActionButton
                className={styles.mapButton}
                text="View on Google Maps"
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
              />
            </aside>
          </div>
        </section>

        <section className={styles.contactTiles} aria-label="Contact information">
          <ContactTile icon="phone" className={styles.phoneTile}>
            <div className={styles.phoneTileNumbers}>
              {phoneLinks.map(({ phone, href }) => <a href={href} key={phone}>{phone}</a>)}
            </div>
            <p>Call us for project details, site visits, and general enquiries.</p>
          </ContactTile>

          <ContactTile icon="email" className={styles.emailTile}>
            <a className={styles.tileTitle} href={`mailto:${contact.email}`}>{contact.email}</a>
            <p>Drop us an email and we’ll get back to you as soon as possible.</p>
          </ContactTile>

          <ContactTile icon="location" className={styles.locationTile}>
            <a className={styles.tileTitle} href={directionsUrl} target="_blank" rel="noreferrer">Birtamode, Jhapa</a>
            <p>{contact.address}</p>
          </ContactTile>
        </section>

      </div>
      </div>
    </main>
  );
}
