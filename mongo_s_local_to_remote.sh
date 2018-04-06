echo "`tput setaf 5`You are about to:`tput op`"
echo "`tput setaf 5`     • Dump mongo database fabloch-server`tput op`"
echo "`tput setaf 5`     • Restore to mlab for app fabloch-server-staging`tput op`"

read -p "`tput setaf 3`\"Y\" to proceed (or any letter to cancel)...`tput op`" -n 1 -r
echo    # (optional) move to a new line

if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "`tput setaf 5`Deleting previous dump...`tput op`"
  rm -rf dump
  echo "`tput setaf 2`    ✔︎ dump complete: on`tput op`"

  echo "`tput setaf 5`Dumping...`tput op`"
  mongodump --db fabloch-server
  echo "`tput setaf 2`    ✔︎ dump complete: on`tput op`"

  echo "`tput setaf 5`Updating heroku code with master...`tput op`"
  mongorestore -h ds055872.mlab.com:55872 -d heroku_9qllsv9w -u robo3t -p robo3tmlb dump/fabloch-server
  echo "`tput setaf 2`    ✔︎ code updated`tput op`"

  echo "`tput setaf 2`✔︎✔︎✔︎ ALL DONE WITH SUCCESS ✔︎✔︎✔︎`tput op`"
  printf \\a

else
  echo "`tput setaf 1`✘✘✘ CANCELED ✘✘✘`tput op`"

fi
