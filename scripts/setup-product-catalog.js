#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Strapi Product Catalog with i18n...\n');

// Content type schemas
const schemas = {
  category: {
    "kind": "collectionType",
    "collectionName": "categories",
    "info": {
      "singularName": "category",
      "pluralName": "categories",
      "displayName": "Category"
    },
    "options": {
      "draftAndPublish": true
    },
    "pluginOptions": {
      "i18n": {
        "localized": true
      }
    },
    "attributes": {
      "categoryId": {
        "type": "uid",
        "targetField": "name"
      },
      "name": {
        "type": "string",
        "required": true,
        "pluginOptions": {
          "i18n": {
            "localized": true
          }
        }
      },
      "status": {
        "type": "enumeration",
        "enum": ["active", "inactive"],
        "default": "active"
      },
      "shortDescription": {
        "type": "text",
        "pluginOptions": {
          "i18n": {
            "localized": true
          }
        }
      },
      "longDescription": {
        "type": "richtext",
        "pluginOptions": {
          "i18n": {
            "localized": true
          }
        }
      }
    }
  },
  
  segment: {
    "kind": "collectionType",
    "collectionName": "segments",
    "info": {
      "singularName": "segment",
      "pluralName": "segments",
      "displayName": "Segment"
    },
    "options": {
      "draftAndPublish": true
    },
    "pluginOptions": {
      "i18n": {
        "localized": true
      }
    },
    "attributes": {
      "segmentId": {
        "type": "uid",
        "targetField": "name"
      },
      "name": {
        "type": "string",
        "required": true,
        "pluginOptions": {
          "i18n": {
            "localized": true
          }
        }
      },
      "status": {
        "type": "enumeration",
        "enum": ["active", "inactive"],
        "default": "active"
      }
    }
  },
  
  membership: {
    "kind": "collectionType",
    "collectionName": "memberships",
    "info": {
      "singularName": "membership",
      "pluralName": "memberships",
      "displayName": "Membership"
    },
    "options": {
      "draftAndPublish": true
    },
    "pluginOptions": {
      "i18n": {
        "localized": true
      }
    },
    "attributes": {
      "membershipId": {
        "type": "uid",
        "targetField": "name"
      },
      "name": {
        "type": "string",
        "required": true,
        "pluginOptions": {
          "i18n": {
            "localized": true
          }
        }
      },
      "criteria": {
        "type": "json",
        "pluginOptions": {
          "i18n": {
            "localized": true
          }
        }
      },
      "benefits": {
        "type": "json",
        "pluginOptions": {
          "i18n": {
            "localized": true
          }
        }
      },
      "status": {
        "type": "enumeration",
        "enum": ["active", "inactive"],
        "default": "active"
      }
    }
  },
  
  product: {
    "kind": "collectionType",
    "collectionName": "products",
    "info": {
      "singularName": "product",
      "pluralName": "products",
      "displayName": "Product"
    },
    "options": {
      "draftAndPublish": true
    },
    "pluginOptions": {
      "i18n": {
        "localized": true
      }
    },
    "attributes": {
      "productId": {
        "type": "uid",
        "targetField": "name"
      },
      "code": {
        "type": "string",
        "required": true,
        "unique": true,
        "regex": "^[A-Z_]+$"
      },
      "name": {
        "type": "string",
        "required": true,
        "pluginOptions": {
          "i18n": {
            "localized": true
          }
        }
      },
      "shortDescription": {
        "type": "text",
        "maxLength": 255,
        "pluginOptions": {
          "i18n": {
            "localized": true
          }
        }
      },
      "longDescription": {
        "type": "richtext",
        "pluginOptions": {
          "i18n": {
            "localized": true
          }
        }
      },
      "features": {
        "type": "component",
        "repeatable": true,
        "component": "product.feature",
        "pluginOptions": {
          "i18n": {
            "localized": true
          }
        }
      },
      "interestRate": {
        "type": "float"
      },
      "status": {
        "type": "enumeration",
        "enum": ["active", "inactive"],
        "default": "active"
      },
      "category": {
        "type": "relation",
        "relation": "manyToOne",
        "target": "api::category.category",
        "inversedBy": "products"
      },
      "eligibilitySegments": {
        "type": "relation",
        "relation": "manyToMany",
        "target": "api::segment.segment"
      },
      "membershipTiers": {
        "type": "relation",
        "relation": "manyToMany",
        "target": "api::membership.membership"
      },
      "documentsRequired": {
        "type": "json",
        "pluginOptions": {
          "i18n": {
            "localized": true
          }
        }
      },
      "image": {
        "type": "media",
        "multiple": false,
        "required": false,
        "allowedTypes": ["images"],
        "pluginOptions": {
          "i18n": {
            "localized": true
          }
        }
      }
    }
  }
};

// Component schema
const featureComponent = {
  "collectionName": "components_product_features",
  "info": {
    "displayName": "Feature",
    "icon": "star"
  },
  "options": {},
  "attributes": {
    "featureKey": {
      "type": "string",
      "required": true
    },
    "featureLabel": {
      "type": "string",
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "icon": {
      "type": "string"
    }
  }
};

// Create content types
Object.entries(schemas).forEach(([name, schema]) => {
  const dir = path.join(__dirname, `../src/api/${name}/content-types/${name}`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'schema.json'),
    JSON.stringify(schema, null, 2)
  );
  console.log(`✅ Created ${name} content type`);
});

// Create component
const componentDir = path.join(__dirname, '../src/components/product');
fs.mkdirSync(componentDir, { recursive: true });
fs.writeFileSync(
  path.join(componentDir, 'feature.json'),
  JSON.stringify(featureComponent, null, 2)
);
console.log('✅ Created feature component');

// Create controllers
const controllerTemplate = (name) => `'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::${name}.${name}');
`;

Object.keys(schemas).forEach(name => {
  const dir = path.join(__dirname, `../src/api/${name}/controllers`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `${name}.js`),
    controllerTemplate(name)
  );
  console.log(`✅ Created ${name} controller`);
});

// Create services
const serviceTemplate = (name) => `'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::${name}.${name}');
`;

Object.keys(schemas).forEach(name => {
  const dir = path.join(__dirname, `../src/api/${name}/services`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `${name}.js`),
    serviceTemplate(name)
  );
  console.log(`✅ Created ${name} service`);
});

// Create routes
const routeTemplate = (name) => `'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::${name}.${name}');
`;

Object.keys(schemas).forEach(name => {
  const dir = path.join(__dirname, `../src/api/${name}/routes`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `${name}.js`),
    routeTemplate(name)
  );
  console.log(`✅ Created ${name} routes`);
});

console.log('\n🎉 Setup complete! Run "npm run develop" to start your Strapi server.');