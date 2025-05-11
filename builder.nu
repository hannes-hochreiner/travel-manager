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
  log info "copying manifest.json"
  cp manifest.json $var_html
  log info "copying icon.svg"
  cp icon.svg $var_html
  log info "creating service worker"
  create_service_worker $src $var_html
  # log info "copying sw.js"
  # cp sw.js $var_html
  log info "copying worker.js"
  cp worker.js $var_html
  log info "copying components"
  cp -r components $var_html
  chmod -R 755 $var_html
  log info "copying pages"
  cp -r pages $var_html
  chmod -R 755 $var_html
  log info "copying objects"
  cp -r objects $var_html
  chmod -R 755 $var_html
  
  log info "build complete"
}

def --env augment_path [] {
  $env.PATH = [
    ...$env.PATH
    ...($env.buildInputs | split row -r '\s+' | each {|item| $"($item)/bin"})
  ]
}

def create_service_worker [
  source_path: string
  output_path: string
] {
  {
    version: (random uuid),
    project_artifacts: [
      './',
      './index.html',
      './manifest.json',
      './icon.svg',
      './repo.js',
      './worker.js',
      ...(ls -la $"($source_path)/pages" | get name | each {|x| $"./($x | path relative-to $source_path)"}),
      ...(ls -la $"($source_path)/components" | get name | each {|x| $"./($x | path relative-to $source_path)"}),
      ...(ls -la $"($source_path)/objects" | get name | each {|x| $"./($x | path relative-to $source_path)"}),
    ]
  } | to json | tera -t $"($source_path)/sw.js.tera" -s | save $"($output_path)/sw.js"
}
