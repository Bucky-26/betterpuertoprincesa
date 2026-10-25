import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import CategoryList, { type CategoryItem } from '../ui/CategoryList';
import { useTranslation } from '../../hooks/useTranslation';

import { serviceCategories } from '../../data/yamlLoader';

export default function ServicesSection({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  const { t } = useTranslation();

  return (
    <Section>
      <Heading level={1}>{title || t('services.title')}</Heading>
      <Text className="mb-8 text-lg text-gray-600">
        {description || t('services.description')}
      </Text>
      <CategoryList
        items={serviceCategories.categories as CategoryItem[]}
        basePath="/services"
        columns={2}
      />
    </Section>
  );
}
