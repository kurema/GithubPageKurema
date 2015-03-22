/// <reference path="scripts/typings/marked/marked.d.ts" />
var SiteInfomation = (function () {
    function SiteInfomation() {
        this.title = "";
        this.author = "";
        this.isLoaded = false;
    }
    SiteInfomation.prototype.LoadJSON = function (filename) {
        var _this = this;
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            try  {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var siteInfoJson = JSON.parse(xhr.responseText);
                        _this.title = siteInfoJson.title;
                        _this.author = siteInfoJson.author;
                        _this.isLoaded = true;
                    } else {
                        throw false;
                    }
                }
            } catch (e) {
                alert("読み込みに失敗しました。");
                return 0;
            }
            _this.Apply();
        };
        xhr.open("GET", filename);
        xhr.send();
    };

    SiteInfomation.prototype.Apply = function () {
        this.ApplyAuthor();
        this.ApplyTitle();
    };

    SiteInfomation.prototype.ApplyTitle = function () {
        this.ApplyByClassName("title", this.title);
        document.title = this.title;
    };
    SiteInfomation.prototype.ApplyAuthor = function () {
        this.ApplyByClassName("author", this.author);
    };

    SiteInfomation.prototype.ApplyByClassName = function (classname, content) {
        var els = document.getElementsByClassName(classname);
        for (var i = 0; i < els.length; i++) {
            els[i].childNodes[0].nodeValue = content;
        }
    };
    return SiteInfomation;
})();

var GithubApi = (function () {
    function GithubApi() {
        this.APIUrl = "https://api.github.com";
    }
    GithubApi.prototype.GetJSON = function (site, callback) {
        GithubApi.GetJSONSimple(this.APIUrl + site, callback);
    };

    GithubApi.GetJSONSimple = function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status = 200) {
                    callback(JSON.parse(xhr.responseText));
                }
            }
        };
        xhr.open("GET", url);
        xhr.send();
    };

    GithubApi.prototype.GetUserJSON = function (user, callback) {
        this.GetJSON("/users/" + user, callback);
    };
    return GithubApi;
})();

var ContentManagement = (function () {
    function ContentManagement() {
    }
    ContentManagement.AddSection = function (value, id) {
        var content = document.getElementById("article");
        var newSection = document.createElement("section");
        if (id) {
            newSection.setAttribute("id", id);
        }
        newSection.insertAdjacentHTML("beforeend", value);
        content.appendChild(newSection);
    };

    ContentManagement.AddSectionMarkdown = function (value, id) {
        this.AddSection(marked(value), id);
    };
    return ContentManagement;
})();

var siteinfo;

window.onload = function () {
    siteinfo = new SiteInfomation();
    siteinfo.LoadJSON("./user/main/siteinfo.json");

    var githubApi = new GithubApi();
    githubApi.GetUserJSON("kurema", function (content) {
        var githubImg = document.getElementById("githubImage");
        githubImg.setAttribute("src", content.avatar_url);

        var githubUserLink = document.getElementById("githubUserLink");
        githubUserLink.setAttribute("href", content.html_url);
        githubUserLink.innerText = content.name;

        GithubApi.GetJSONSimple(content.repos_url, function (contentRepo) {
            for (var j = 0; j < contentRepo.length; j++) {
                ContentManagement.AddSection("<h1><a href='" + contentRepo[j].html_url + "'>" + contentRepo[j].name + "</a></h1><p>" + contentRepo[j].description + "</p>");
            }
        });
    });
};
//# sourceMappingURL=app.js.map
