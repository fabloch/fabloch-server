echo "`tput setaf 5`Git status reminder:`tput op`"
git rev-parse --abbrev-ref HEAD
git status -s
echo "`tput setaf 5`ON HK-STAGING, you are about to:`tput op`"
echo "`tput setaf 5`  • push new code`tput op`"

read -p "`tput setaf 3`\"Y\" to proceed (or any letter to cancel)...`tput op`" -n 1 -r
echo    # (optional) move to a new line

if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "`tput setaf 5`Activating maintenance mode...`tput op`"
  heroku maintenance:on -a fabloch-server-staging
  echo "`tput setaf 2`    ✔︎ maintenance: on`tput op`"

  echo "`tput setaf 5`Updating heroku code with master...`tput op`"
  git push hk-staging staging:master
  echo "`tput setaf 2`    ✔︎ code updated`tput op`"

  echo "`tput setaf 5`Deactivating maintenance mode...`tput op`"
  heroku maintenance:off -a fabloch-server-staging
  echo "`tput setaf 2`    ✔︎ maintenance: off`tput op`"

  echo "`tput setaf 2`✔︎✔︎✔︎ ALL DONE WITH SUCCESS ✔︎✔︎✔︎`tput op`"
  printf \\a

else
  echo "`tput setaf 1`✘✘✘ CANCELED ✘✘✘`tput op`"

fi
