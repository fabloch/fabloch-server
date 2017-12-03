echo "`tput setaf 5`Git status reminder:`tput op`"
git rev-parse --abbrev-ref HEAD
git status -s
echo "`tput setaf 5`You are about to  `tput op`"
echo "`tput setaf 5`  • drop the fabloch-server database`tput op`"

read -p "`tput setaf 3`\"Y\" to proceed (or any letter to cancel)...`tput op`" -n 1 -r
echo    # (optional) move to a new line

if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "`tput setaf 5`Droping fabloch-server local database...`tput op`"
  mongo fabloch-server --eval "printjson(db.dropDatabase())"
  echo "`tput setaf 2`✔︎ database droped`tput op`"
else
  echo "`tput setaf 1`✘✘✘ CANCELED ✘✘✘`tput op`"
fi
