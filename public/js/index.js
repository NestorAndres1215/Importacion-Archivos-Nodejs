    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Poppins', 'sans-serif'],
          },
          keyframes: {
            float: {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-10px)' },
            },
            pulseGlow: {
              '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
              '50%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)' },
            }
          },
          animation: {
            float: 'float 3s ease-in-out infinite',
            pulseGlow: 'pulseGlow 2s ease-in-out infinite',
          }
        }
      }
    }

        document.getElementById('searchInput').addEventListener('input', function() {
      const query = this.value.toLowerCase();
      document.querySelectorAll('.file-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? '' : 'none';
      });
    });