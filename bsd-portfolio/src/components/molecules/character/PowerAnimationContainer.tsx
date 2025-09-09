import React from 'react';
import {
  NullificationAnimation,
  DarkFabricAnimation,
  TigerTransformAnimation,
  GravityFieldAnimation,
  DeductionGlowAnimation,
  MaterialCreateAnimation
} from '../../atoms/character';

interface PowerAnimationContainerProps {
  animationType: string;
  isVisible: boolean;
}

const PowerAnimationContainer: React.FC<PowerAnimationContainerProps> = ({
  animationType,
  isVisible
}) => {
  if (!isVisible) return null;

  const renderAnimation = () => {
    switch (animationType) {
      case 'nullification':
        return <NullificationAnimation />;
      case 'darkFabric':
        return <DarkFabricAnimation />;
      case 'tigerTransform':
        return <TigerTransformAnimation />;
      case 'gravityField':
        return <GravityFieldAnimation />;
      case 'deductionGlow':
        return <DeductionGlowAnimation />;
      case 'materialCreate':
        return <MaterialCreateAnimation />;
      default:
        return null;
    }
  };

  return <>{renderAnimation()}</>;
};

export default PowerAnimationContainer;