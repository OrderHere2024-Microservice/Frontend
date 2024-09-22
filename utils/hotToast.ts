import toast from 'react-hot-toast';

type ToastStatus = 'success' | 'error' | 'promise';

const hotToast = (
  status: ToastStatus,
  text: string,
  promise?: Promise<unknown>,
) => {
  switch (status) {
    case 'success':
      toast.success(text, {
        duration: 2000,
        style: {
          padding: '20px',
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      break;
    case 'error': {
      toast.error(text, {
        duration: 2000,
        style: {
          padding: '20px',
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      break;
    }
    case 'promise': {
      if (promise) {
        toast
          .promise(
            promise,
            {
              loading: 'Saving...',
              success: () => `Settings saved!`,
              error: () => `Could not save.`,
            },
            {
              style: {
                padding: '20px',
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            },
          )
          .catch((error) => {
            console.error('Toast promise error:', error);
          });
      }
      break;
    }
    default:
      break;
  }
};

export default hotToast;
