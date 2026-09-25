import type {MappedProductOptions} from '@shopify/hydrogen';
import type {ProductVariantFragment} from 'storefrontapi.generated';

/** Compare like-for-like packs against the current single-pack selling price. */
export function packSavings(options: MappedProductOptions[], variant: Pick<ProductVariantFragment, 'price' | 'product' | 'selectedOptions'> | null | undefined) {
  if (!variant) return null;
  const pack = variant.selectedOptions.find(option => /^pack(?: size)?$/i.test(option.name));
  const count = Number(pack?.value.match(/^pack of (\d+)$/i)?.[1]);
  if (!pack || !Number.isSafeInteger(count) || count <= 1) return null;
  const single = options.find(option => option.name === pack.name)?.optionValues
    .find(value => /^pack of 1$/i.test(value.name))?.firstSelectableVariant;
  if (!single || single.product.handle !== variant.product.handle || single.price.currencyCode !== variant.price.currencyCode) return null;
  if (variant.selectedOptions.some(option => option.name !== pack.name && !single.selectedOptions.some(other => other.name === option.name && other.value === option.value))) return null;
  const total = Math.round(Number(single.price.amount) * count * 100) / 100;
  const actual = Number(variant.price.amount);
  if (!Number.isFinite(total) || !Number.isFinite(actual) || actual <= 0 || total <= actual) return null;
  const percent = Math.round((total - actual) / total * 100);
  if (percent < 1) return null;
  return {price: {...variant.price, amount: total.toFixed(2)}, percent, count};
}
