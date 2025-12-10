
// This file serves as your "Public Folder" manager.
// To use your own images:
// 1. Place your image files in the same directory as index.html (or a dedicated /images folder).
// 2. Update the paths below. Example: logo: './my-hotel-logo.png'

export const ASSETS = {
  BRANDING: {
    // -------------------------------------------------------------------------
    // LOGO CONFIGURATION
    // -------------------------------------------------------------------------
    // If you do not have a logo.png file, the app will gracefully fall back 
    // to the sophisticated SVG "Nomada" logo defined in Sidebar.tsx.
    // To test an image logo, you can use a URL here.
    LOGO: '', 
  },
  BACKGROUNDS: [
    'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1600&auto=format&fit=crop', // Iconic Morocco Arch
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop', // Luxury Room Interior
    'https://images.unsplash.com/photo-1580835056707-160ec8c9735d?q=80&w=1600&auto=format&fit=crop', // Tangier Coast
    'https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=1600&auto=format&fit=crop', // Dark Luxury Texture
  ],
  DINING: {
    BREAKFAST: {
        NOMAD_MORNING: 'https://images.unsplash.com/photo-1533089862017-561484579abc?q=80&w=800&auto=format&fit=crop',
        SUNRISE: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
        ACAI: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop',
    },
    LUNCH: {
        BURGER: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
        SALAD: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
        LOBSTER: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop',
    },
    DINNER: {
        TAGINE: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=800&auto=format&fit=crop',
        RISOTTO: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop',
        SEABASS: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?q=80&w=800&auto=format&fit=crop',
    },
    SNACKS: {
        CHEESE: 'https://images.unsplash.com/photo-1631379578550-7038263db699?q=80&w=800&auto=format&fit=crop',
        TART: 'https://images.unsplash.com/photo-1551024601-569d6f7e1278?q=80&w=800&auto=format&fit=crop',
        FRIES: 'https://images.unsplash.com/photo-1573080496987-a199f8cd4054?q=80&w=800&auto=format&fit=crop',
    }
  },
  ACTIVITIES: {
    CAVES: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop', // Nature/Caves
    MEDINA: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1000&auto=format&fit=crop', // Medina Arch
    SPARTEL: 'https://images.unsplash.com/photo-1566373859203-c079219036c6?q=80&w=1000&auto=format&fit=crop', // Lighthouse/Ocean
    HAFA: 'https://images.unsplash.com/photo-1585671720292-6243868661db?q=80&w=1000&auto=format&fit=crop', // Ocean Tea View
    MUSEUM: 'https://images.unsplash.com/photo-1552599797-42c235b2a0c6?q=80&w=1000&auto=format&fit=crop', // Museum Interior
  }
};
