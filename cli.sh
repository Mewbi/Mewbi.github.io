#!/usr/bin/env bash

#--------------------------------------[ Header ]
#	Author
#		Felipe Fernandes
#
#	Program
#		CLI Portfolio
#
#	Description
#		My personal portfolio, but in CLI mode
#
#------------------------------------------------

readonly -a BORDERS=(┃ ━ ┏ ┓ ┗ ┛)
readonly -a OPTS=("About me" "Projects" "Contact") # I'm avoiding using associative arrays to increase compatibility
readonly BASE_URL="https://raw.githubusercontent.com/Mewbi/Mewbi.github.io/master/text"

border_line() {

  local c="${COLUMNS}"

	for (( i = 0; i < ${c}; i++ )); do

    if [[ "${i}" == "0" ]]; then
      echo -n "${1}"
      continue
    fi

    if [[ "${i}" == "$((c - 1))" ]]; then
			echo -n "${3}"
      continue
    fi

    echo -n "${2}"
	done
}

border_sides() {

  local y="${2}" # Init position
  local l="${3}" # Limit lines to print
  local c="${COLUMNS}"
  for ((i = 0; i < ${l}; i++)); do
    ((y++))
    set_cursor "${y}" "0" # Move cursor to the init of terminal
    echo -n "${1}"
    set_cursor "${y}" "${c}" # Move cursor to the end of terminal
    echo -n "${1}"
  done

}

set_cursor() {
  # $1 - Line
  # $2 - Column
  echo -en "\033[${1};${2}f" # Move cursor to the init of terminal
}

validate_terminal_size() {
  local c="${COLUMNS}"
  local l="${LINES}"

  local min_columns="50"
  local min_lines="25"

  if (( "${c}" < "${min_columns}" || "${l}" < "${min_lines}" )); then
    echo -en "\033[2J" # Clear screen
    echo -en "\033[0;0f" # Move cursor to the init of terminal
    echo "Terminal too small"
    echo "Required at least ${min_columns} columns and ${min_lines} lines"
    exit;
  fi
}

interface_base() {
  env > /dev/null # Necessary to get terminal size info
  local c="${COLUMNS}"
  local l="${LINES}"

  # Validate terminal size
  validate_terminal_size

  # Draw borders
  border_line "${BORDERS[2]}" "${BORDERS[1]}" "${BORDERS[3]}" # Parameters ┏ ━ ┓
  border_sides "${BORDERS[0]}" "1" "$((l - 8))"
  border_line "${BORDERS[4]}" "${BORDERS[1]}" "${BORDERS[5]}" # Parameters ┗ ━ ┛

  border_line "${BORDERS[2]}" "${BORDERS[1]}" "${BORDERS[3]}" # Parameters ┏ ━ ┓
  border_sides "${BORDERS[0]}" "$((l - 5))" "1"
  border_line "${BORDERS[4]}" "${BORDERS[1]}" "${BORDERS[5]}" # Parameters ┗ ━ ┛

  border_line "${BORDERS[2]}" "${BORDERS[1]}" "${BORDERS[3]}" # Parameters ┏ ━ ┓
  border_sides "${BORDERS[0]}" "$((l - 2))" "1"
  border_line "${BORDERS[4]}" "${BORDERS[1]}" "${BORDERS[5]}" # Parameters ┗ ━ ┛

  # Set Texts
  local title="[ Mewbi ]"
  local pos_x=$((c / 2))
  local pos_x=$(( pos_x - ${#title} / 2 ))
  local pos_y="0"
  set_cursor "${pos_y}" "${pos_x}" 
  echo -n "${title}"

}

interface_home() {

  interface_base

  local c="${COLUMNS}"
  local l="${LINES}"

  # Set Texts
  local footer="q - Quit"
  local pos_x=$((c / 2))
  local pos_x=$(( pos_x - ${#footer} / 2 ))
  local pos_y="$((l - 1))"
  set_cursor "${pos_y}" "${pos_x}" 
  echo -n "${footer}"

  local n=1
  for opt in "${OPTS[@]}"; do
    local pos_x="4"
    local pos_y=$((n * 2 + 1))
    set_cursor "${pos_y}" "${pos_x}" 
    echo -n "${n} - ${opt}"
    ((n++))
  done

}

interface_about_me() {
  echo -en "\033[2J" # Clear screen
  echo -en "\033[0;0f" # Move cursor to the init of terminal
  interface_base

  local pos_x="4"
  local pos_y="3"
  set_cursor "${pos_y}" "${pos_x}"
  echo -n "> Loading..."

  local tmpfile=$(mktemp)
  local url="${BASE_URL}/about.txt"
  local status_code=$(curl -s "${url}" -w "%{http_code}" -o $tmpfile)
  local status=$? # Command status, if != 0, commands got an error

  if (( "${status_code}" != "200" || "${status}" != "0" )); then
    rm ${tmpfile}

    local c="${COLUMNS}"
    local l="${LINES}"

    local pos_x="4"
    local pos_y="5"
    set_cursor "${pos_y}" "${pos_x}"
    echo -n "> Got and error"
  
    local footer="Press ENTER to continue"
    local pos_x=$((c / 2))
    local pos_x=$(( pos_x - ${#footer} / 2 ))
    local pos_y="$((l - 1))"
    set_cursor "${pos_y}" "${pos_x}" 
    echo -n "${footer}"
  
    local pos_x="4"
    local pos_y=$((l- 4))
    set_cursor "${pos_y}" "${pos_x}" 
    read -p "Select > "

    return
  fi

  local about=$(cat ${tmpfile})
  rm ${tmpfile}

  # Calculate age
  local birth=$(date +%s --date="2001-11-1")
  local now=$(date +%s)
  local age=$(( (${now} - ${birth} ) / 31536000 ))
  
  echo "${about//\$idade/${age}}" | less

  return
}

interface_projects() {
  echo -en "\033[2J" # Clear screen
  echo -en "\033[0;0f" # Move cursor to the init of terminal
  interface_base
  
  local pos_x="4"
  local pos_y="3"
  set_cursor "${pos_y}" "${pos_x}"
  echo -n "> In progress..."
  
  local l="${LINES}"
  local c="${COLUMNS}"

  local footer="b - Back | q - Quit"
  local pos_x=$((c / 2))
  local pos_x=$(( pos_x - ${#footer} / 2 ))
  local pos_y="$((l - 1))"
  set_cursor "${pos_y}" "${pos_x}" 
  echo -n "${footer}"
    
  local pos_x="4"
  local pos_y=$((l- 4))
  set_cursor "${pos_y}" "${pos_x}" 
  read -p "Select > "

  return
}

interface_contact() {
  echo -en "\033[2J" # Clear screen
  echo -en "\033[0;0f" # Move cursor to the init of terminal
  interface_base

  local pos_x="4"
  local pos_y="3"
  set_cursor "${pos_y}" "${pos_x}"
  echo -n "> E-mail"
  
  local pos_x="7"
  local pos_y="4"
  set_cursor "${pos_y}" "${pos_x}"
  echo -n "felipefernandesgsc@gmail.com"
  
  local pos_x="4"
  local pos_y="6"
  set_cursor "${pos_y}" "${pos_x}"
  echo -n "> LinkedIn"
  
  local pos_x="7"
  local pos_y="7"
  set_cursor "${pos_y}" "${pos_x}"
  echo -n "in/felipe-fernandes-gsc"
  
  local pos_x="4"
  local pos_y="9"
  set_cursor "${pos_y}" "${pos_x}"
  echo -n "> Github"
  
  local pos_x="7"
  local pos_y="10"
  set_cursor "${pos_y}" "${pos_x}"
  echo -n "github.com/Mewbi"
  
  local pos_x="4"
  local pos_y="12"
  set_cursor "${pos_y}" "${pos_x}"
  echo -n "> Discord"
  
  local pos_x="7"
  local pos_y="13"
  set_cursor "${pos_y}" "${pos_x}"
  echo -n "Mewbi"
  
  local l="${LINES}"
  local c="${COLUMNS}"

  local footer="b - Back | q - Quit"
  local pos_x=$((c / 2))
  local pos_x=$(( pos_x - ${#footer} / 2 ))
  local pos_y="$((l - 1))"
  set_cursor "${pos_y}" "${pos_x}" 
  echo -n "${footer}"

  local pos_x="4"
  local pos_y=$((l- 4))

  while : ; do
    set_cursor "${pos_y}" "${pos_x}"
    read -p "Select > " choose
    local choose=${choose// /} # Remove space
    local choose=${choose,,} # Lowercase
    case "${choose}" in
      q)
        echo -en "\033[2J" # Clear screen
        echo -en "\033[0;0f" # Move cursor to the init of terminal
        exit
      ;;
    
      b)
        break
      ;;
    
    esac
  done
}

main() {
  echo -en "\033[2J" # Clear screen
  echo -en "\033[0;0f" # Move cursor to the init of terminal
  env > /dev/null # Necessary to get terminal size info
  interface_home

  local l="${LINES}"

  local pos_x="4"
  local pos_y=$((l- 4))
  set_cursor "${pos_y}" "${pos_x}" 
  read -p "Select > " choose

  local choose=${choose// /} # Remove space
  local choose=${choose,,} # Lowercase
  case "${choose}" in
    q)
      echo -en "\033[2J" # Clear screen
      echo -en "\033[0;0f" # Move cursor to the init of terminal
      exit
    ;;

    1)
      interface_about_me
    ;;
    
    2)
      interface_projects
    ;;
    
    3)
      interface_contact
    ;;

  esac  
 
}

# Rezise Terminal
trap "main" SIGWINCH

while :; do
  main "$@"
done
