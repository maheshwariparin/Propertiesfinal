import Sitemap from 'react-router-sitemap';
import routes from './routes';

new Sitemap(routes)
  .build('https://dmhproperties.co.in')
  .save('./public/sitemap.xml');
