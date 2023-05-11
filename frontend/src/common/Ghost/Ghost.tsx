// import riveWASMResource from '@rive-app/canvas';
import { useRive } from '@rive-app/react-canvas';

// RuntimeLoader.setWasmUrl(riveWASMResource);

export const Ghost = () => {
  const { RiveComponent } = useRive(
    {
      src: '/riv/ghost.riv',
      autoplay: true,
      stateMachines: ['Waiting'],
    },
    { fitCanvasToArtboardHeight: true },
  );

  return <RiveComponent />;
};
