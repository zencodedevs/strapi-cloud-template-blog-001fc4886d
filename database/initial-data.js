module.exports = async () => {
  const strapi = require('@strapi/strapi');
  
  // Create categories
  const categories = [
    { name: 'Savings Accounts', nameGeo: 'შემნახველი ანგარიშები', nameRus: 'Сберегательные счета' },
    { name: 'Loan Products', nameGeo: 'სესხის პროდუქტები', nameRus: 'Кредитные продукты' },
    { name: 'Credit Cards', nameGeo: 'საკრედიტო ბარათები', nameRus: 'Кредитные карты' }
  ];
  
  for (const cat of categories) {
    await strapi.entityService.create('api::category.category', {
      data: {
        name: cat.name,
        status: 'active',
        locale: 'en',
        localizations: [
          { name: cat.nameGeo, locale: 'ka' },
          { name: cat.nameRus, locale: 'ru' }
        ]
      }
    });
  }
};