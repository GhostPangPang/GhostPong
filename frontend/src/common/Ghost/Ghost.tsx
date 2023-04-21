import riveWASMResource from '@rive-app/canvas/rive.wasm?url';
import { useRive, RuntimeLoader } from '@rive-app/react-canvas';

RuntimeLoader.setWasmUrl(riveWASMResource);

export const Ghost = () => {
  const { RiveComponent } = useRive(
    {
      src: 'ghost.riv',
      autoplay: true,
      stateMachines: ['State Machine 1'],
    },
    { fitCanvasToArtboardHeight: true },
  );

  return <RiveComponent />;
};
