export const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Self Made Portraits",
        "url": "https://self-made-portraits.com/",
        "logo": "/static/media/logo.eb6defb17e198b507ae4.png",
        "email": "",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "",
            "email": "info@self-made-portraits.com",
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
