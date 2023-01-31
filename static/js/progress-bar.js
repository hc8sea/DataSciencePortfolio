Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '2px'
  })

  var app = new Vue({
    el: '#app',
    data: {
      percentage: 0
    },
    mounted: function() {
      this.fetchProgress()
    },
    methods: {
      fetchProgress: function() {
        var vm = this
        axios.get('/progress').then(function(response) {
          vm.percentage = response.data.progress
        })
      }
    }
  })
