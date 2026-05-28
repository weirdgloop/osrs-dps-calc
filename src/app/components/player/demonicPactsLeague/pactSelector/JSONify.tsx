const jsonReplacer = (_key: unknown, value: unknown) => {
  if (value instanceof Map) {
    return Object.fromEntries(value);
  }

  if (
    typeof value === 'string'
    && value.length > 100
    && value.startsWith('data:')
  ) {
    return '[DATA_URL_PLACEHOLDER]';
  }

  return value;
};

export const jsonToString = (value: unknown) => JSON.stringify(value, jsonReplacer, 2);

interface JSONifyProps {
  className?: string;
  value: unknown;
}

export const JSONify = (props: JSONifyProps) => {
  const {
    className,
    value,
  } = props;
  return (
    <pre className={className}>{jsonToString(value)}</pre>
  );
};
