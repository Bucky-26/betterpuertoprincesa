import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import CategoryList, { type CategoryItem } from '../ui/CategoryList';
import { useTranslation } from '../../hooks/useTranslation';

import { governmentCategories } from '../../data/yamlLoader';

export default function GovernmentActivitySection({
  title,
  description,
}: {
  title?: string;
  description?: string;
} = {}) {
  const { t } = useTranslation();

  return (
    <Section id="government">
      <Heading level={1}>{title || t('governmentActivity.title')}</Heading>
      <Text className="mb-8 text-lg text-gray-600">
        {description || t('governmentActivity.description')}
      </Text>
      <CategoryList
        items={governmentCategories.categories as CategoryItem[]}
        basePath="/government"
        columns={2}
      />
    </Section>
  );
}
