const categories = [
  { key: "patient-monitor", label: "Patient Monitor", description: "Monitoring systems for ICU, OT, and emergency care.", imageUrl: "/images/equipment/device1.jpg", sortOrder: 1 },
  { key: "radiology", label: "Radiology", description: "Mobile and fixed imaging systems for diagnostic departments.", imageUrl: "/images/defibs/AgfaGEAMXMobileX-RaySystems.jpg", sortOrder: 2 },
  { key: "hospital-furniture", label: "Hospital Furniture", description: "Beds, transfer support, ICU support, and clinical furniture.", imageUrl: "/images/section3.jpg", sortOrder: 3 },
  { key: "sterility-disinfection", label: "Sterility & Disinfection", description: "Autoclaves, sterilizers, and CSSD support products.", imageUrl: "/images/section5.jpg", sortOrder: 4 },
  { key: "cardiology", label: "Cardiology", description: "ECG, stress test, and cardiac response equipment.", imageUrl: "/images/defibs/defebrillator2.jpg", sortOrder: 5 },
  { key: "anesthesia", label: "Anesthesia", description: "Anaesthesia workstations and operation theatre support.", imageUrl: "/images/equipment/device10.jpg", sortOrder: 6 },
  { key: "ventilators", label: "Ventilators", description: "Ventilation support for critical care and transport.", imageUrl: "/images/ventils/Hamilton-Ventillator.jpg", sortOrder: 7 },
  { key: "respiratory-care", label: "Respiratory Care", description: "Oxygen, CPAP, BPAP, and respiratory therapy systems.", imageUrl: "/images/ventils/portable-ventilator.jpg", sortOrder: 8 },
  { key: "defibrillators", label: "Defibrillators", description: "Emergency cardiac response equipment for hospitals and clinics.", imageUrl: "/images/defibs/Meditech Defibrillator monitor Defi 9.jpg", sortOrder: 9 },
  { key: "ortho-implants", label: "Ortho Implants", description: "Spine, trauma, plates, screws, and fixation systems.", imageUrl: "/images/ortho-implants/CapLOX II Pedicle Screw System.jpg", sortOrder: 10 }
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
  }
];

module.exports = { categories, products, content };
