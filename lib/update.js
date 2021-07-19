

const Update = {
  /**
   * This function is used when you receive a row with package data from the
   * NPM registry, and want to convert it into attributes that can be saved
   * in a nodezoo/npm entity.
   */
  entdata_of_npm_data(pkg_data) {
    const { id: pkg_id, doc } = pkg_data

    const {
      'dist-tags': { latest: pkg_version },
      readmeFilename: pkg_readme,
      description: pkg_desc
    } = doc

    const pkg_giturl = doc.repository && 'git' === doc.repository.type
      ? doc.repository.url
      : null


    const pkg_original_doc = JSON.stringify(doc)

    return {
      name: pkg_id,
      version: pkg_version,
      giturl: pkg_giturl,
      desc: pkg_desc,
      readme: pkg_readme,
      original_doc: pkg_original_doc
    }
  }
}


module.exports = Update
