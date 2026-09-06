/** دمج أسماء الفئات الشرطية (Tailwind classnames) */
export const cn = (...classes) =>
  classes.filter(Boolean).join(' ')