module.exports = function(shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);
  require('shipit-npm')(shipit);

  shipit.initConfig({

    default: {
      servers: 'app@mentor1.cochart.net',
      workspace: '/tmp/mentor-slack-integration-deploy',
      deployTo: '/home/app/mentor-slack-integration',
      repositoryUrl: 'git@github.com:Cloudchart/mentor-slack-integration.git',
      keepReleases: 2,
      shared: {
        overwrite: true,
        dirs: ['node_modules'],
        files: ['.env'],
      },
      npm: {
        remote: true,
        installFlags: '--production',
        triggerEvent: 'sharedEnd',
      },
    },

  })

  // shipit.on('published', function() {
  //   return shipit.remote(`cd ${shipit.currentPath} && forever restart mentor-slack-integration`)
  // })

}