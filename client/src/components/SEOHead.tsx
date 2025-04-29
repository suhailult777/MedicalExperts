import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Consult General Physicians Online - Internal Medicine Specialists | Apollo247',
  description = 'Consult with certified general physicians and internal medicine specialists online. Book appointments with experienced doctors at Apollo247.',
  keywords = 'general physician, internal medicine, online consultation, doctor appointment, Apollo247',
  canonicalUrl = 'https://www.apollo247.com/specialties/general-physician-internal-medicine',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    </Helmet>
  );
};

export default SEOHead;
