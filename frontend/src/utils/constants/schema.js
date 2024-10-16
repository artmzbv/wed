export const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Self Made Portraits",
        "url": "https://self-made-portraits.com/",
        "logo": "/static/media/logo_new.aff8f91e4ee24826af57.jpg",
        "email": "",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "",
            "email": "",
            "contactType": "Customer Service",
            "areaServed": "EU",
        },
        "sameAs": [
            "https://www.linkedin.com/company/",
            "https://x.com"
        ],
        "numberOfEmployees": {
          "@type": "QuantitativeValue",
          "minValue": 1,
          "maxValue": 10
        },
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "UK"
        },
        "description": "",
        "foundingDate": "",
        "vatID": "",
        "iso6523Code": "",
        "naics": [
          {
            "@type": "DefinedTerm",
            "termCode": "523999",
            "inDefinedTermSet": "https://www.census.gov/naics/",
            "name": "Miscellaneous Financial Investment Activities"
          }
        ]
    }
