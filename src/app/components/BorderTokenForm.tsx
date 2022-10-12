import React from 'react';
import { useUIDSeed } from 'react-uid';
import get from 'just-safe-get';
import { EditTokenObject } from '@/types/tokens';
import Heading from './Heading';
import { TokenTypes } from '@/constants/TokenTypes';
import { ResolveTokenValuesResult } from '@/plugin/tokenHelpers';
import Stack from './Stack';
import BorderTokenDownShiftInput from './BorderTokenDownShiftInput';

const propertyTypes = {
  color: TokenTypes.COLOR,
  width: TokenTypes.BORDER_WIDTH,
  style: 'strokeStyle',
};

export default function BorderTokenForm({
  internalEditToken,
  resolvedTokens,
  handleBorderValueChange,
  handleBorderValueDownShiftInputChange,
}: {
  internalEditToken: Extract<EditTokenObject, { type: TokenTypes.BORDER }>;
  resolvedTokens: ResolveTokenValuesResult[];
  handleBorderValueChange: React.ChangeEventHandler;
  handleBorderValueDownShiftInputChange: (newInputValue: string, property: string) => void;
}) {
  const seed = useUIDSeed();

  return (
    <Stack direction="column" gap={2}>
      <Stack direction="row" gap={2} justify="between" align="center">
        <Heading>Value</Heading>
      </Stack>
      <Stack gap={2} direction="column">
        {Object.entries(internalEditToken.schema.schemas.value.properties ?? {}).map(([key], keyIndex) => (
          <BorderTokenDownShiftInput
            name={key}
            key={`border-input-${seed(keyIndex)}`}
            value={typeof internalEditToken.value === 'object' ? get(internalEditToken.value, key, '') : ''}
            type={propertyTypes[key as keyof typeof propertyTypes]}
            resolvedTokens={resolvedTokens}
            handleChange={handleBorderValueChange}
            setInputValue={handleBorderValueDownShiftInputChange}
          />
        ))}
      </Stack>
    </Stack>
  );
}
