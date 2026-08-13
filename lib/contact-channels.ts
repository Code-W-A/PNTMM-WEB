import type { SiteContact, SiteSocial } from "@/config/site"

export type ContactChannelType =
  | "email"
  | "phone"
  | "address"
  | "hours"
  | "facebook"
  | "instagram"
  | "youtube"
  | "linkedin"

export interface ContactChannelData {
  type: ContactChannelType
  label: string
  value: string
  href?: string
  external?: boolean
}

/** Canale directe (fără social) — doar valori definite în config. */
export function getDirectContactChannels(
  contact: SiteContact,
): ContactChannelData[] {
  const channels: ContactChannelData[] = []

  if (contact.email) {
    channels.push({
      type: "email",
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    })
  }

  if (contact.phone) {
    channels.push({
      type: "phone",
      label: "Telefon",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
    })
  }

  if (contact.address) {
    channels.push({
      type: "address",
      label: contact.addressLabel ?? "Adresă",
      value: contact.address,
    })
  }

  if (contact.hours) {
    channels.push({
      type: "hours",
      label: "Program",
      value: contact.hours,
    })
  }

  return channels
}

/** @deprecated Prefer getDirectContactChannels + getSocialLinks. */
export function getContactChannels(
  contact: SiteContact,
  social: SiteSocial,
): ContactChannelData[] {
  void social
  return getDirectContactChannels(contact)
}

export interface SocialLinkData {
  platform: string
  url: string
  label: string
}

/** Linkuri sociale publice — doar cele definite în config. */
export function getSocialLinks(social: SiteSocial): SocialLinkData[] {
  const links: SocialLinkData[] = []

  if (social.facebook) {
    links.push({
      platform: "facebook",
      url: social.facebook,
      label: "Facebook",
    })
  }
  if (social.instagram) {
    links.push({
      platform: "instagram",
      url: social.instagram,
      label: "Instagram",
    })
  }
  if (social.youtube) {
    links.push({
      platform: "youtube",
      url: social.youtube,
      label: "YouTube",
    })
  }
  if (social.linkedin) {
    links.push({
      platform: "linkedin",
      url: social.linkedin,
      label: "LinkedIn",
    })
  }

  return links
}
