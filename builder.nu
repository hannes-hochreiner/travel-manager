#!/usr/bin/env -S nu --stdin
use std/log

def main [] {}

def "main build" [
  src: string
] {
  augment_path
  print $env

  let out = $env.out
  let var_html = $"($out)/var/html"

  cd $src
  mkdir $var_html

  log info "copying repo"
  cp repo.js $var_html
  log info "copying index.html"
  cp index.html $var_html
  log info "copying components"
  cp -r components $var_html
  chmod -R 755 $var_html
  log info "copying pages"
  cp -r pages $var_html
  chmod -R 755 $var_html
  log info "copying data"
  cp -r data $var_html
  chmod -R 755 $var_html
  
  log info "build complete"
}

def --env augment_path [] {
  $env.PATH = [
    ...$env.PATH
    ...($env.buildInputs | split row -r '\s+' | each {|item| $"($item)/bin"})
  ]
}