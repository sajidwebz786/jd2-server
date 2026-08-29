const categories = [
  { key: "ortho-implants", label: "Ortho Implants", description: "Spine, trauma, plates, screws, and fixation systems.", imageUrl: "/images/ortho-implants/CapLOX II Pedicle Screw System.jpg", sortOrder: 1 },
  { key: "patient-monitor", label: "Patient Monitor", description: "Monitoring systems for ICU, OT, and emergency care.", imageUrl: "/images/equipment/device1.jpg", sortOrder: 2 },
  { key: "radiology", label: "Radiology", description: "Mobile and fixed imaging systems for diagnostic departments.", imageUrl: "/images/defibs/AgfaGEAMXMobileX-RaySystems.jpg", sortOrder: 3 },
  { key: "hospital-furniture", label: "Hospital Furniture", description: "Beds, transfer support, ICU support, and clinical furniture.", imageUrl: "/images/section3.jpg", sortOrder: 4 },
  { key: "sterility-disinfection", label: "Sterility & Disinfection", description: "Autoclaves, sterilizers, and CSSD support products.", imageUrl: "/images/section5.jpg", sortOrder: 5 },
  { key: "cardiology", label: "Cardiology", description: "ECG, stress test, and cardiac response equipment.", imageUrl: "/images/defibs/defebrillator2.jpg", sortOrder: 6 },
  { key: "anesthesia", label: "Anesthesia", description: "Anaesthesia workstations and operation theatre support.", imageUrl: "/images/equipment/device10.jpg", sortOrder: 7 },
  { key: "ventilators", label: "Ventilators", description: "Ventilation support for critical care and transport.", imageUrl: "/images/ventils/Hamilton-Ventillator.jpg", sortOrder: 8 },
  { key: "respiratory-care", label: "Respiratory Care", description: "Oxygen, CPAP, BPAP, and respiratory therapy systems.", imageUrl: "/images/ventils/portable-ventilator.jpg", sortOrder: 9 },
  { key: "defibrillators", label: "Defibrillators", description: "Emergency cardiac response equipment for hospitals and clinics.", imageUrl: "/images/defibs/Meditech Defibrillator monitor Defi 9.jpg", sortOrder: 10 },
];

const products = [
  { name: "Hamilton Ventilator", slug: "hamilton-ventilator", category: "ventilators", shortDescription: "Advanced ICU ventilation with multiple modes and monitoring.", description: "ICU ventilator for reliable critical care respiratory support.", imageUrl: "/images/ventils/Hamilton-Ventillator.jpg", featured: true, sortOrder: 1 },
  { name: "Portable Ventilator", slug: "portable-ventilator", category: "ventilators", shortDescription: "Compact respiratory support for transport and mobile ICU use.", description: "Transport-ready ventilation support for emergency movement and mobile care.", imageUrl: "/images/ventils/portable-ventilator.jpg", featured: true, sortOrder: 2 },
  { name: "Infant Incubator", slug: "infant-incubator", category: "ventilators", shortDescription: "Temperature controlled neonatal intensive care system.", description: "Neonatal care system for temperature-controlled support in critical care settings.", imageUrl: "/images/ventils/Infant Incubator - Yanko Design.jpg", featured: false, sortOrder: 3 },
  { name: "Defibrillator Monitor Defi 9", slug: "defibrillator-monitor-defi-9", category: "defibrillators", shortDescription: "Professional AED with integrated patient monitoring.", description: "Emergency response defibrillator with monitoring capability.", imageUrl: "/images/defibs/Meditech Defibrillator monitor Defi 9.jpg", featured: true, sortOrder: 1 },
  { name: "Philips AED", slug: "philips-aed", category: "defibrillators", shortDescription: "Reliable automated external defibrillator for emergency care.", description: "AED support for hospitals, clinics, and emergency response locations.", imageUrl: "/images/defibs/CalmedEquipmentNewPhilipsAEDs.jpg", featured: true, sortOrder: 2 },
  { name: "Compact Defibrillator", slug: "compact-defibrillator", category: "defibrillators", shortDescription: "Emergency cardiac care device for hospitals and clinics.", description: "Compact cardiac response device for emergency departments and clinical teams.", imageUrl: "/images/defibs/defebrillator2.jpg", featured: false, sortOrder: 3 },
  { name: "CapLOX II Pedicle Screw System", slug: "caplox-ii-pedicle-screw-system", category: "ortho-implants", shortDescription: "Advanced spinal fixation system in titanium alloy.", description: "Spinal fixation system for surgeon-led implant programs.", imageUrl: "/images/ortho-implants/CapLOX II Pedicle Screw System.jpg", featured: true, sortOrder: 1 },
  { name: "TowerLOX MIS Pedicle Screw System", slug: "towerlox-mis-pedicle-screw-system", category: "ortho-implants", shortDescription: "Minimally invasive spinal solution for advanced procedures.", description: "Minimally invasive pedicle screw system for advanced spine procedures.", imageUrl: "/images/ortho-implants/TowerLOX MIS Pedicle Screw System.jpg", featured: false, sortOrder: 2 },
  { name: "Locked Compression Plates", slug: "locked-compression-plates", category: "ortho-implants", shortDescription: "Bone plate systems in stainless steel and titanium options.", description: "Bone plate systems for trauma and fixation requirements.", imageUrl: "/images/ortho-implants/1_5MM Safety Lock Strut Plate.jpg", featured: true, sortOrder: 3 }
];

const additionalOrthoProducts = [
  ["ACL/PCL Reconstruction Instrument Set", "acl-pcl-reconstruction-instrument-set.png", "Ligament reconstruction instruments"], ["ACL/PCL Interference Screw", "acl-pcl-screw.png", "Ligament fixation"], ["AC Button", "ac-button.png", "Acromioclavicular fixation"], ["ABS Button", "ABS-Button.png", "Cortical button fixation"], ["ABS Button with Adjustable Loop", "abs-button-with-adjustable-loop.png", "Adjustable-loop fixation"], ["Adjustable Endo Button with Loop", "adjustable-endo-button-with-loop.png", "Adjustable cortical fixation"], ["Anchor Suture", "Anchor-Suture.png", "Soft-tissue fixation"], ["Ankle Syndesmosis Repair System", "ankle-syndesmosis-repair.png", "Syndesmosis fixation"], ["Cancellous Screw", "cancellous screw.png", "Cancellous bone fixation"], ["Endo Button with Loop", "endo-button-with-loop.png", "Cortical fixation"], ["Fiber Tape", "fiber-tape.png", "Broad soft-tissue support"], ["Fibre Wire with Single Needle", "fibre-wire-with-single-needle.png", "Suture and repair"], ["Herbert Screw Instrument Set", "herbert-screw-instrument-set.png", "Headless screw instrumentation"], ["Herbert Screws", "herbert-screws.png", "Headless compression fixation"], ["Multi-hole Patella Plate", "Mulyi-hole-patella.png", "Patella fracture fixation"], ["No-button Adjustable Loop", "nobutton-adjustable-loop.png", "Adjustable-loop fixation"], ["Ortho Instrument Set", "ortho-tools.png", "Orthopedic instrumentation"], ["Patella Arrow Locking Plate", "patella-arrow-locking-plate.png", "Patella fracture fixation"], ["Patella Star Locking Plate", "Patella-star-lockibg-plate.png", "Patella fracture fixation"], ["Pre-loaded Suture Anchor", "pre-loaded-anchor.png", "Soft-tissue anchoring"], ["Suture Disk — Conical Holes", "suture-disk-conical-Holes.png", "Suture fixation accessory"], ["Suture Disk — Regular Slotted", "suture-disk-regular-slotted.png", "Suture fixation accessory"], ["Suture Wire", "suture-wire.png", "Orthopedic cerclage"], ["Washer", "washer.png", "Screw fixation accessory"], ["Safety Lock Proximal Humerus Plate", "Safety Lock Periarticular Proximal Humerus Plate.jpg", "Proximal humerus fixation"]
].map(([name, filename, family], index) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), category: "ortho-implants", shortDescription: `${family} product from the JD2 orthopedic portfolio.`, description: `${family}. Contact JD2 Meditech for specifications, availability, and applicable product documentation.`, imageUrl: `/images/ortho-implants/${filename}`, featured: [1, 7, 14].includes(index), sortOrder: 10 + index }));
products.push(...additionalOrthoProducts);

const starterGroups = {
  "patient-monitor": ["Multiparameter Patient Monitor", "Bedside Patient Monitor", "Portable Vital Signs Monitor", "Central Monitoring Station", "Transport Patient Monitor"],
  radiology: ["Mobile Digital X-Ray System", "Fixed Digital X-Ray System", "C-Arm Imaging System", "Portable X-Ray Unit", "Radiology Workstation"],
  "hospital-furniture": ["Electric ICU Bed", "Five-Function Hospital Bed", "Patient Transfer Trolley", "Examination Table", "Bedside Locker"],
  "sterility-disinfection": ["Horizontal Hospital Autoclave", "Vertical Autoclave", "Tabletop Steam Sterilizer", "Instrument Sterilizer", "CSSD Sterilization Unit"],
  cardiology: ["Twelve-Channel ECG Machine", "Three-Channel ECG Machine", "Cardiac Stress Test System", "Portable ECG Machine", "Cardiac Patient Monitor"],
  anesthesia: ["Anaesthesia Workstation", "Two-Gas Anaesthesia Machine", "Three-Gas Anaesthesia Machine", "Anaesthesia Ventilator", "Anaesthesia Patient Monitor"],
  "respiratory-care": ["Oxygen Concentrator", "Portable Oxygen Concentrator", "Auto CPAP System", "BiPAP Ventilation System", "Respiratory Therapy Device"]
};
const starterImages = ["device1.jpg", "device2.jpg", "device3.jpg", "device4.jpg", "device5.jpg"];
Object.entries(starterGroups).forEach(([category, names], groupIndex) => {
  names.forEach((name, index) => products.push({
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    category,
    shortDescription: `${name} for hospital and institutional healthcare requirements.`,
    description: `${name} available through JD2 Meditech. Specifications, configuration and imagery can be updated from the Admin dashboard.`,
    imageUrl: `/images/equipment/${starterImages[index]}`,
    featured: false,
    active: true,
    sortOrder: 100 + groupIndex * 10 + index
  }));
});

const content = [
  {
    page: "certifications",
    section: "quality-approvals",
    eyebrow: "Quality assurance",
    title: "ISO, ISI, NSIC Approved, WHO GMP",
    body: "JD2 Meditech maintains quality-focused procurement and manufacturing workflows for medical equipment, implants, and clinical support products.",
    sortOrder: 1,
    active: true
  },
  {
    page: "certifications",
    section: "compliance-support",
    eyebrow: "Documentation",
    title: "Certificates and compliance documents",
    body: "Product-specific documentation and approval references are available to support purchase decisions.",
    sortOrder: 2,
    active: true
  },
  {
    page: "founder",
    section: "note",
    eyebrow: "A message from our Founder & CEO",
    title: "Building dependable healthcare partnerships",
    body: "At JD2 Meditech, our purpose is to help healthcare institutions access dependable products, responsive service, and practical procurement support under one roof. We are committed to quality, transparency, and long-term relationships with clinicians, hospitals, and partners. Every solution we provide is guided by the needs of healthcare teams and the patients they serve.",
    imageUrl: "/images/personal-images/seated-image1.jpeg",
    sortOrder: 1,
    active: true
  }
];

module.exports = { categories, products, content };
