import React, { useCallback, useState } from 'react';
import IconMinus from '@/icons/minus.svg';
import IconButton from './IconButton';
import Box from './Box';
import Input from './Input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
} from './DropdownMenu';
import { PropertyDropdownMenuRadioElement } from './PropertyDropdownMenuRadioElement';
import { Properties } from '@/constants/Properties';
import { CompositionTokenProperty, CompositionTokenValue } from '@/types/CompositionTokenProperty';

export default function SingleCompositionTokenForm({
  index,
  property,
  value,
  tokenValue,
  properties,
  error,
  setTokenValue,
  onRemove,
  handleOrderObj,
  handleError,
}: {
  index: number;
  property: string;
  value: string;
  tokenValue: CompositionTokenValue;
  properties: string[];
  error: boolean;
  setTokenValue: (neweTokenValue: CompositionTokenValue) => void;
  onRemove: (property: string) => void;
  handleOrderObj: (newOrderObj: object) => void;
  handleError: (newError: false) => void;
}) {
  const [menuOpened, setMenuOpened] = useState(false);
  const onPropertySelected = useCallback((newProperty: string) => {
    // keep the order of the properties when select new property
    const newOrderObj: CompositionTokenValue = {};
    let keysInTokenValue = Object.keys(tokenValue);
    keysInTokenValue.splice(index, 1, newProperty);
    keysInTokenValue.map((key, index) => {
      newOrderObj[key as keyof typeof Properties] = String(index)
    });
    handleOrderObj(newOrderObj);

    // set newTokenValue
    delete tokenValue[property as keyof typeof Properties];
    tokenValue[newProperty as keyof typeof Properties] = value;
    setTokenValue(tokenValue);
    handleError(false);
  }, [tokenValue]);

  const onAliasChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    tokenValue[property as CompositionTokenProperty] = e.target.value;
    setTokenValue(tokenValue);
  }, [tokenValue]);

  const handleToggleMenu = useCallback(() => {
    setMenuOpened(!menuOpened);
  }, [menuOpened]);

  const handleRemove = useCallback(() => {
    onRemove(property);
  }, [onRemove, property]);

  return (
    <Box>
      <Box css={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '$3',
        '& > label': {
          flex: 3,
          fontSize: '$5 !important',
          '& > div > input': {
            height: '$10',
          },
        },
      }}
      >
        <DropdownMenu open={menuOpened} onOpenChange={handleToggleMenu}>
          <DropdownMenuTrigger css={{ flex: 4, minHeight: '$10', border: `1px solid ${error && property.length === 0 ? '$fgDanger' : '$borderMuted'}` }}>
            <span>{property}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={2} className='content scroll-container' css={{ maxHeight: '$11', backgroundColor: '$bgDefault', color: '$text'}}>
            <DropdownMenuRadioGroup value={property}>
              {properties.length > 0
                && properties.map((property, index) => <PropertyDropdownMenuRadioElement key={index} property={property} index={index} propertySelected={onPropertySelected} />)}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Input
          required
          full
          value={value}
          onChange={onAliasChange}
          type="text"
          name="alias"
          placeholder="Alias"
        />
        <Box css={{ width: '$5', marginRight: '$3' }}>
          <IconButton
            tooltip="Remove this style"
            dataCy="button-style-remove-multiple"
            onClick={handleRemove}
            icon={<IconMinus />}
          />
        </Box>
      </Box>
    </Box>
  );
}
