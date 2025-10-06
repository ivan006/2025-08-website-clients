<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'ResponsiveLayout',
  data() {
    return {
      isSmallScreen: false,
      leftDrawerOpen: false,
      siteTitle: 'Lorum Ipsum'
    };
  },
  methods: {
    checkScreenWidth() {
      this.isSmallScreen = window.innerWidth <= 1151;
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    }
  },
  mounted() {
    this.checkScreenWidth();
    window.addEventListener('resize', this.checkScreenWidth);
  },
  unmounted() {
    window.removeEventListener('resize', this.checkScreenWidth);
  }
};
</script>
