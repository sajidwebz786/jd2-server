const products = [
  ["Hamilton Ventilator", "ventilators", "Advanced ICU ventilation with multiple modes and monitoring.", "/images/ventils/Hamilton-Ventillator.jpg", true],
  ["Portable Ventilator", "ventilators", "Compact respiratory support for transport, emergency, and mobile ICU use.", "/images/ventils/portable-ventilator.jpg", true],
  ["Infant Incubator", "ventilators", "Temperature controlled neonatal intensive care system.", "/images/ventils/Infant Incubator - Yanko Design.jpg", false],
  ["Samsung Ventilator System", "ventilators", "Advanced monitoring platform for critical care environments.", "/images/ventils/Samsung sonar.jpg", false],
  ["Defibrillator Monitor Defi 9", "defibrillators", "Professional defibrillator with integrated patient monitoring.", "/images/defibs/Meditech Defibrillator monitor Defi 9.jpg", true],
  ["Philips AED", "defibrillators", "Reliable automated external defibrillator for emergency response.", "/images/defibs/CalmedEquipmentNewPhilipsAEDs.jpg", true],
  ["Compact Defibrillator", "defibrillators", "Emergency cardiac care device for hospitals and clinics.", "/images/defibs/defebrillator2.jpg", false],
  ["CapLOX II Pedicle Screw System", "ortho-implants", "Titanium alloy spinal fixation system for advanced orthopedic procedures.", "/images/ortho-implants/CapLOX II Pedicle Screw System.jpg", true],
  ["TowerLOX MIS Pedicle Screw System", "ortho-implants", "Minimally invasive spinal solution for surgeon-led implant programs.", "/images/ortho-implants/TowerLOX MIS Pedicle Screw System.jpg", false],
  ["Locked Compression Plates", "ortho-implants", "Bone plate systems in stainless steel and titanium options.", "/images/ortho-implants/1_5MM Safety Lock Strut Plate.jpg", true],
  ["Cannulated and Cancellous Screws", "ortho-implants", "Precision screws for trauma and bone fixation applications.", "/images/ortho-implants/13ea40df965dcbd9c546c03033808a0b.jpg", false],
  ["Proximal Humerus Plate", "ortho-implants", "Periarticular locking plate system for shoulder trauma cases.", "/images/ortho-implants/Safety Lock Periarticular Proximal Humerus Plate.jpg", false]
].map(([name, category, shortDescription, imageUrl, featured], sortOrder) => ({
  name,
  category,
  shortDescription,
  imageUrl,
  featured,
  sortOrder,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  description: `${shortDescription} JD2 Meditech supports hospitals with product selection, quotation guidance, and dependable supply coordination.`,
  specifications: ["ISO quality process", "Hospital procurement support", "Warranty and service guidance"]
}));

const content = [
  {
    page: "home",
    section: "hero",
    eyebrow: "Orthopedic implants and critical care equipment",
    title: "JD2 Meditech Pvt. Ltd.",
    body: "Manufacturer and exporter of orthopedic implants and supplier of dependable medical equipment for hospitals, clinics, and healthcare procurement teams.",
    imageUrl: "/images/slider1.jpg",
    ctaLabel: "Request Quote",
    ctaUrl: "/quote",
    sortOrder: 1
  },
  {
    page: "about",
    section: "profile",
    title: "Company Profile",
    body: "JD2 Meditech Pvt. Ltd. has served the orthopedic market since 2017 with implants, instruments, and medical equipment solutions developed with clinical expertise and international quality standards.",
    imageUrl: "/images/section3.jpg",
    sortOrder: 1
  },
  {
    page: "contact",
    section: "address",
    title: "Registered Address",
    body: "20-1-113/A, Korlagunta Block-1, Korlagunta, Chittoor, Tirupati Urban, Andhra Pradesh, India - 517501",
    sortOrder: 1
  }
];

module.exports = { products, content };
