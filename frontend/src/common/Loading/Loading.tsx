import { useRive } from '@rive-app/react-canvas';

export const Loading = () => {
  const { RiveComponent } = useRive({
    src: '/riv/loading.riv',
    autoplay: true,
    stateMachines: ['Loading'],
  });

  return <RiveComponent style={{ height: '100px', width: '100px' }} />;
};
