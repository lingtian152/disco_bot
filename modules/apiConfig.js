async function fetchData () {
  try {
    const { Octokit } = await import('@octokit/core')

    const octokit = new Octokit({
      auth: ''
    })

    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: 'lingtian152',
        repo: 'disc_bot',
        path: 'config.json', // 文件路径应该是相对于仓库根目录的相对路径
        ref: 'config' // 分支名称
      }
    )

    // 检查响应状态码
    if (response.status === 200) {
      // 解码文件内容
      const content = Buffer.from(response.data.content, 'base64').toString()
      return content // 返回文件内容
    } else {
      throw new Error(`Failed to fetch file content: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error:', error.message)
    throw error // 抛出错误
  }
}

async function readData (type) {
  if (type === '') {
    console.log('Please provide a type.')
    return
  }

  try {
    const content = await fetchData() // 获取文件内容
    const jsonData = JSON.parse(content) // 解析 JSON 数据
    return jsonData[type] // 返回指定属性的值
  } catch (error) {
    console.error('Error:', error.message)
    throw error // 抛出错误
  }
}

module.exports = {
  readData // 导出 readData 函数
}
